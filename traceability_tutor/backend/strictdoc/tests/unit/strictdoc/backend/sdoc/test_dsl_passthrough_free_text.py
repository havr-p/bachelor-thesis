from strictdoc.backend.sdoc.models.anchor import Anchor
from strictdoc.backend.sdoc.models.document import SDocDocument
from strictdoc.backend.sdoc.reader import SDReader
from strictdoc.backend.sdoc.writer import SDWriter


def test_001_free_text():
    input_sdoc = """
[DOCUMENT]
TITLE: Test Doc

[FREETEXT]
Hello world
[/FREETEXT]
""".lstrip()

    reader = SDReader()

    document = reader.read(input_sdoc)
    assert isinstance(document, SDocDocument)

    writer = SDWriter()
    output = writer.write(document)

    assert input_sdoc == output


def test_002_freetext_empty():
    input_sdoc = """
[DOCUMENT]
TITLE: Test Doc

[FREETEXT]
[/FREETEXT]
""".lstrip()

    reader = SDReader()

    document = reader.read(input_sdoc)
    assert isinstance(document, SDocDocument)

    writer = SDWriter()
    output = writer.write(document)

    assert input_sdoc == output


def test_003_free_text_ending_free_text_not_recognized():
    input_sdoc = """
[DOCUMENT]
TITLE: Test Doc

[FREETEXT]
AAA  [/FREETEXT]
[/FREETEXT]
""".lstrip()

    reader = SDReader()

    document = reader.read(input_sdoc)
    assert isinstance(document, SDocDocument)

    writer = SDWriter()
    output = writer.write(document)

    assert input_sdoc == output


def test_020_free_text_inline_link():
    input_sdoc = """
[DOCUMENT]
TITLE: Test Doc

[FREETEXT]
String 1
String 2 [LINK: REQ-001] String 3
String 4
[/FREETEXT]
""".lstrip()

    reader = SDReader()

    document = reader.read(input_sdoc)
    assert isinstance(document, SDocDocument)

    writer = SDWriter()
    output = writer.write(document)

    assert input_sdoc == output


def test_040_free_text_anchor_between_empty_lines():
    input_sdoc = """
[DOCUMENT]
TITLE: Test Doc

[FREETEXT]
String 1
String 2 String 3

[ANCHOR: REQ-001, Requirements document]

String 4
[/FREETEXT]
""".lstrip()

    reader = SDReader()

    document = reader.read(input_sdoc)
    assert isinstance(document, SDocDocument)
    assert len(document.free_texts[0].parts) == 3
    assert isinstance(document.free_texts[0].parts[1], Anchor)
    assert document.free_texts[0].parts[1].value == "REQ-001"

    assert isinstance(document.free_texts[0].parts[0], str)
    assert isinstance(document.free_texts[0].parts[2], str)

    writer = SDWriter()
    output = writer.write(document)

    assert input_sdoc == output


def test_041_free_text_anchor_start_of_free_text():
    input_sdoc = """
[DOCUMENT]
TITLE: Test Doc

[FREETEXT]
[ANCHOR: REQ-001, Requirements document]

Test
[/FREETEXT]
""".lstrip()

    reader = SDReader()

    document = reader.read(input_sdoc)
    assert isinstance(document, SDocDocument)
    assert len(document.free_texts[0].parts) == 2
    assert isinstance(document.free_texts[0].parts[0], Anchor)
    assert document.free_texts[0].parts[0].value == "REQ-001"

    assert isinstance(document.free_texts[0].parts[1], str)
    writer = SDWriter()
    output = writer.write(document)

    assert input_sdoc == output


def test_042_free_text_anchor_end_of_free_text():
    input_sdoc = """
[DOCUMENT]
TITLE: Test Doc

[FREETEXT]
String 1
String 2 String 3

[ANCHOR: REQ-001, Requirements document]
[/FREETEXT]
""".lstrip()

    reader = SDReader()

    document = reader.read(input_sdoc)
    assert isinstance(document, SDocDocument)
    assert len(document.free_texts[0].parts) == 2
    assert isinstance(document.free_texts[0].parts[0], str)
    assert isinstance(document.free_texts[0].parts[1], Anchor)
    assert document.free_texts[0].parts[1].value == "REQ-001"

    writer = SDWriter()
    output = writer.write(document)

    assert input_sdoc == output


def test_043_free_text_anchor_between_lines():
    input_sdoc = """
[DOCUMENT]
TITLE: Test Doc

[FREETEXT]
String 1
String 2
[ANCHOR: REQ-001]
String 4
String 5
[/FREETEXT]
""".lstrip()

    reader = SDReader()

    document = reader.read(input_sdoc)
    assert isinstance(document, SDocDocument)
    assert len(document.free_texts[0].parts) == 3
    assert isinstance(document.free_texts[0].parts[0], str)
    assert isinstance(document.free_texts[0].parts[1], Anchor)
    assert isinstance(document.free_texts[0].parts[2], str)

    writer = SDWriter()
    output = writer.write(document)

    assert input_sdoc == output


def test_050_free_text_anchor_inline_not_recognized():
    input_sdoc = """
[DOCUMENT]
TITLE: Test Doc

[FREETEXT]
String 1
String 2 [ANCHOR: REQ-001] String 3
String 4
[/FREETEXT]
""".lstrip()

    reader = SDReader()

    document = reader.read(input_sdoc)
    assert isinstance(document, SDocDocument)
    assert len(document.free_texts[0].parts) == 1
    assert isinstance(document.free_texts[0].parts[0], str)

    writer = SDWriter()
    output = writer.write(document)

    assert input_sdoc == output


def test_052_free_text_anchor_not_recognized_when_connected_to_text():
    input_sdoc = """
[DOCUMENT]
TITLE: Test Doc

[FREETEXT]
String 1
String 2 String 3
[ANCHOR: REQ-001, Requirements document]
[/FREETEXT]
""".lstrip()

    reader = SDReader()

    document: SDocDocument = reader.read(input_sdoc)
    assert isinstance(document, SDocDocument)

    assert len(document.free_texts[0].parts) == 2
    assert isinstance(document.free_texts[0].parts[0], str)
    assert isinstance(document.free_texts[0].parts[1], Anchor)
    writer = SDWriter()
    output = writer.write(document)

    assert input_sdoc == output


def test_053_free_text_anchor_not_recognized_when_connected_to_text_newline_after():
    input_sdoc = """
[DOCUMENT]
TITLE: Test Doc

[FREETEXT]
String 1
String 2 String 3
[ANCHOR: REQ-001, Requirements document]

TEST
[/FREETEXT]
""".lstrip()

    reader = SDReader()

    document: SDocDocument = reader.read(input_sdoc)
    assert isinstance(document, SDocDocument)

    assert len(document.free_texts[0].parts) == 3
    assert isinstance(document.free_texts[0].parts[0], str)
    assert isinstance(document.free_texts[0].parts[1], Anchor)
    assert isinstance(document.free_texts[0].parts[2], str)
    writer = SDWriter()
    output = writer.write(document)

    assert input_sdoc == output
