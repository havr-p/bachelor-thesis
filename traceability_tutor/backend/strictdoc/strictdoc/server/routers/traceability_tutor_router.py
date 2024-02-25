import os
import urllib
from copy import deepcopy
from datetime import datetime
from typing import Optional

from fastapi import APIRouter
from starlette.responses import JSONResponse, Response

from strictdoc.backend.sdoc.models.document import SDocDocument
from strictdoc.core.traceability_index import TraceabilityIndex

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

    @router.get("/json_all", response_class=Response)
    def get_json_all_requirements():
        export_action = ExportAction(
            project_config=project_config,
            parallelizer=parallelizer,
        )
        export_action.build_index()
        traceability_index: TraceabilityIndex = export_action.traceability_index
        print(traceability_index)
        print('hi')
        titles = [SDocDocument.get_title(doc) for doc in traceability_index.document_tree.document_list]
        return JSONResponse(
            content=titles
        )

    return router