import os
import urllib
from copy import deepcopy
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, UploadFile, File
from starlette.responses import JSONResponse, Response

from strictdoc.backend.sdoc.models.document import SDocDocument
from strictdoc.backend.sdoc.models.node import SDocNode, SDocNodeField
from strictdoc.backend.sdoc.models.type_system import ReferenceType
from strictdoc.core.document_iterator import DocumentCachingIterator
from strictdoc.core.traceability_index import TraceabilityIndex
from strictdoc.helpers.cast import assert_cast

from strictdoc.helpers.parallelizer import NullParallelizer

from strictdoc.core.actions.export_action import ExportAction

from strictdoc.cli.cli_arg_parser import ServerCommandConfig

from strictdoc import __version__
from strictdoc.core.project_config import ProjectConfig
from strictdoc.export.html.document_type import DocumentType
from strictdoc.export.html.generators.view_objects.diff_screen_results_view_object import (
    DiffScreenResultsViewObject,
)
from strictdoc.export.html.generators.view_objects.diff_screen_view_object import (
    DiffScreenViewObject,
)
from strictdoc.export.html.html_templates import HTMLTemplates
from strictdoc.export.html.renderers.link_renderer import LinkRenderer
from strictdoc.git.change_generator import ChangeContainer, ChangeGenerator
from strictdoc.git.git_client import GitClient
from strictdoc.server.routers.main_router import HTTP_STATUS_PRECONDITION_FAILED


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
        requirements = []
        for document_ in traceability_index.document_tree.document_list:
            document_iterator: DocumentCachingIterator = (
                traceability_index.get_document_iterator(document_)
            )
            for node in document_iterator.all_content():
                if isinstance(node, SDocNode):
                    requirement: SDocNode = assert_cast(node, SDocNode)
                    assert requirement.reserved_uid is not None
                    requirement_parents = [(ref.ref_uid, ref.role) for ref in requirement.get_requirement_references(ReferenceType.PARENT)]
                    requirements.append((requirement.reserved_uid, requirement.requirement_type,
                                         requirement.reserved_title, requirement_parents))

        return JSONResponse(
            content=requirements
        )

    @router.post("/create_new_project", response_class=Response)
    def create_new_project(file: UploadFile = File(...)):
        pass
    #if new greenfield project - create new directory where the project requirements will be stored.
    #each requirement will be stored in a separate file with the requirement UID as the file name.
    #

    return router
