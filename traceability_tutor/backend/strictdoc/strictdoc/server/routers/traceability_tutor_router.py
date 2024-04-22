from fastapi import APIRouter
from starlette.datastructures import FormData
from starlette.requests import Request
from starlette.responses import JSONResponse, Response, PlainTextResponse

from strictdoc.backend.sdoc.models.node import SDocNode
from strictdoc.backend.sdoc.models.type_system import ReferenceType
from strictdoc.backend.sdoc.writer import SDWriter
from strictdoc.core.actions.export_action import ExportAction
from strictdoc.core.document_iterator import DocumentCachingIterator
from strictdoc.core.project_config import ProjectConfig
from strictdoc.core.traceability_index import TraceabilityIndex
from strictdoc.core.transforms.update_requirement import UpdateRequirementTransform, UpdateRequirementResult
from strictdoc.export.html.form_objects.requirement_form_object import RequirementFormObject
from strictdoc.helpers.cast import assert_cast
from strictdoc.helpers.mid import MID
from strictdoc.helpers.parallelizer import NullParallelizer


def create_traceability_tutor_router(
        project_config: ProjectConfig
) -> APIRouter:
    parallelizer = NullParallelizer()
    router = APIRouter()

    @router.get("/requirements/all", response_class=Response)
    def get_json_all_requirements():
        export_action = ExportAction(
            project_config=project_config,
            parallelizer=parallelizer,
        )
        export_action.build_index()
        traceability_index: TraceabilityIndex = export_action.traceability_index
        print(traceability_index)
        print('hi')
        requirements = []
        for document_ in traceability_index.document_tree.document_list:
            document_iterator: DocumentCachingIterator = (
                traceability_index.get_document_iterator(document_)
            )
            for node in document_iterator.all_content():
                if isinstance(node, SDocNode):
                    requirement: SDocNode = assert_cast(node, SDocNode)
                    assert requirement.reserved_uid is not None
                    requirement_parents = [
                        {'parentId': ref.ref_uid.lower(), 'parentRole': ref.role}
                        for ref in requirement.get_requirement_references(ReferenceType.PARENT)
                    ]
                    requirement_dict = {
                        'id': requirement.reserved_uid.lower(),
                        'level': requirement.get_meta_field_value_by_title('LEVEL'),
                        'name': requirement.reserved_title,
                        'statement': requirement.reserved_statement,
                        'status': requirement.reserved_status,
                        'references': requirement_parents,
                        'mid': requirement.reserved_mid
                    }
                    requirements.append(requirement_dict)

        return JSONResponse(
            content=requirements
        )

    @router.get("/requirements/get_form_object/{requirement_id}", response_class=Response)
    async def get_form_object(requirement_id: str):
        export_action = ExportAction(
            project_config=project_config,
            parallelizer=parallelizer,
        )
        export_action.build_index()
        requirement: SDocNode = (
             export_action.traceability_index.get_node_by_mid(
                 MID(requirement_id)
             )
         )
        form_object: RequirementFormObject = (
             RequirementFormObject.create_from_requirement(
                 requirement=requirement
             )
         )
        return JSONResponse(form_object)

    @router.post("/actions/update_requirement")
    async def update_requirement(request: Request):
        export_action = ExportAction(
            project_config=project_config,
            parallelizer=parallelizer,
        )
        export_action.build_index()
        request_form_data: FormData = await request.form()
        request_dict = dict(request_form_data)
        requirement_mid = request_dict["requirement_mid"]
        requirement: SDocNode = (
            export_action.traceability_index.get_node_by_mid(
                MID(requirement_mid)
            )
        )
        document = requirement.document

        assert (
                isinstance(requirement_mid, str) and len(requirement_mid) > 0
        ), f"{requirement_mid}"

        form_object: RequirementFormObject = (
            RequirementFormObject.create_from_request(
                is_new=False,
                requirement_mid=requirement_mid,
                request_form_data=request_form_data,
                document=document,
                exiting_requirement_uid=requirement.reserved_uid,
            )
        )

        form_object.validate(
            traceability_index=export_action.traceability_index,
            context_document=document,
            config=project_config,
        )

        if form_object.any_errors():
            return JSONResponse(
                content=form_object.errors,
                status_code=422,
            )

        update_command = UpdateRequirementTransform(
            form_object=form_object,
            requirement=requirement,
            traceability_index=export_action.traceability_index,
        )
        result: UpdateRequirementResult = update_command.perform()

        # Update the index because other documents might reference this
        # document's sections. These documents will be regenerated on demand,
        # when they are opened next time.
        export_action.traceability_index.update_last_updated()

        # Saving new content to .SDoc files.
        document.ng_needs_generation = True
        document_content = SDWriter().write(document)
        document_meta = document.meta
        with open(
                document_meta.input_doc_full_path, "w", encoding="utf8"
        ) as output_file:
            output_file.write(document_content)

        return PlainTextResponse(status_code=200, content=f'Update of requirement with mid {requirement_mid}  succeed')

    return router
