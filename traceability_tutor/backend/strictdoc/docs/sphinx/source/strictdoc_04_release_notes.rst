Release Notes
$$$$$$$$$$$$$

This document maintains a record of all changes to StrictDoc since November 2023. It serves as a user-friendly version of the changelog, complementing the automatically generated, commit-by-commit changelog available here: `StrictDoc Changelog <https://github.com/strictdoc-project/strictdoc/blob/main/CHANGELOG.md>`_.

0.0.48 (2024-01-24)
===================

The requirement-to-source traceability feature was extended to support linking requirements to the RST files.

One more input scenario was handled for the Create Document workflow. When a project config has ``include_doc_paths`` or ``exclude_doc_paths`` filters specified, and an input document path contradicts to the provided filters, a validation message is shown.

The Project Statistics screen was extended with the **"Sections without any text" metric**. Now it is possible to visualize which sections are still missing any introduction or description (free text).

**The new Machine Identifier (MID)** field has been added to StrictDoc's grammar. The automatic generation of MIDs can be activated per-document using the ``ENABLE_MID: True`` document-level config option. The main driver for this feature is the need of accurate Diff/Changelog results. The new section of the User Guide explains the rationale and the configuration details: :ref:`Machine identifiers (MID) <SECTION-UG-Machine-identifiers-MID>`.

**The Diff and Changelog screens** have been introduced to facilitate a historical comparison of documentation trees. The Diff screen aids in focusing on which document nodes have been altered, while the Changelog functions as a sequential table where changes are displayed as table cells and each cell emphasizes specific details of a particular change.

The Requirements Coverage has been transformed into **the Traceability Matrix** screen. This matrix screen lists all nodes of a documentation graph, along with all their interrelations. The currently generated screen is entirely static. However, future enhancements are planned to include filtering capabilities for the content. The Traceability Matrix feature is disabled by default and has to be activated as ``TRACEABILITY_MATRIX_SCREEN`` in the strictdoc.toml project config file.

**The HTML2PDF feature** has now entered the alpha testing phase. This feature enables printing of documents directly from a browser, which can be done either through the "PDF" screen view or by utilizing the "Export to PDF" button. By default, the HTML2PDF feature is disabled. To activate it, you need to indicate the ``HTML2PDF`` feature in the strictdoc.toml project configuration file.

0.0.47 (2023-11-20)
===================

A **query search engine** is introduced which allows filtering a documentation tree by queries like ``(node.is_requirement and "System" in node["TITLE"])``.
Building on the search engine capability, the "Search" screen is introduced in the web interface. Additionally, it is now possible to specify ``--filter-requirements <query>`` and ``filter-sections <query>`` when running ``export`` and ``passthrough`` commands. The visual design of the project statistics was improved as well as the new design for the search screen has already landed.

The **document option** ``ROOT: True/False`` was introduced to indicate the root documents in the traceability graph. Currently, this option is only used when printing requirement statistics, where the root nodes are skipped when the metric "requirements without parents" is calculated. The root-level requirements by definition have no parent requirements, they can only be parents to other requirements.

When editing Section, **it is now possible to auto-generate a section UID with a corresponding button** which makes the management of section UIDs much easier.

The **stability and the execution time of the CI end-2-end tests for the web interface has been increased**. The sharding of the end-2-end tests was introduced for all systems: macOS, Linux, and Windows. At the same time, the number of Python versions that are tested by each platform's jobs was reduced to maintain a reasonable total number of build jobs.

The requirement-to-source traceability feature was extended with the so-called **single-line markers**. Now it is possible to reference just a single line in a file by using the ``@sdoc(REQ-001)`` marker.

Python 3.12 support has been added to the GitHub CI jobs.

The second generation of StrictDoc's requirements received many updates. The new requirements set will be incorporated to the main documentation very soon (estimated time is until the end of 2023). These requirements are maintained in the ``drafts/requirements`` folder.

The User Guide has been updated to include the **"Security Considerations" chapter**, which provides a warning about unsafe use of StrictDoc if it is deployed to a server on a public network.
