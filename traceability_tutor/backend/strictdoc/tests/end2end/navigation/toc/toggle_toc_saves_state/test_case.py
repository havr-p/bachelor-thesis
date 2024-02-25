from tests.end2end.e2e_case import E2ECase
from tests.end2end.end2end_test_setup import End2EndTestSetup
from tests.end2end.helpers.components.toc import TOC
from tests.end2end.helpers.screens.project_index.screen_project_index import (
    Screen_ProjectIndex,
)
from tests.end2end.server import SDocTestServer


class Test(E2ECase):
    def test(self):
        test_setup = End2EndTestSetup(path_to_test_file=__file__)

        with SDocTestServer(
            input_path=test_setup.path_to_sandbox
        ) as test_server:
            self.open(test_server.get_host_and_port())

            screen_project_index = Screen_ProjectIndex(self)

            screen_project_index.assert_on_screen()
            screen_project_index.assert_contains_document("Document title")

            screen_document = screen_project_index.do_click_on_first_document()

            screen_document.assert_on_screen_document()
            screen_document.assert_header_document_title("Document title")
            screen_document.assert_text("Hello world!")

            screen_toc: TOC = screen_document.get_toc()

            # toc is on the page, open and contains Section title
            screen_toc.assert_toc_opened()
            screen_toc.assert_toc_contains("Section title")

            # hide the toc
            screen_toc.do_toggle_toc()

            # toc is hidden, but still contains Section title
            screen_toc.assert_toc_closed()
            screen_toc.assert_toc_contains("Section title")

            # Suspecting that this is a reason for the flaky test:
            # Element {//*[@data-testid="toc-bar"][@data-state="open"]} was not
            # present after 7 seconds!
            # https://github.com/strictdoc-project/strictdoc/issues/1155
            # Wait for animation to complete.
            self.sleep(1)

            # show the toc
            screen_toc.do_toggle_toc()

            # toc is open
            screen_toc.assert_toc_opened()

        assert test_setup.compare_sandbox_and_expected_output()
