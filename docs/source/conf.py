# Configuration file for the Sphinx documentation builder.
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
project = "LSSTDESC NERSC Docs"
copyright = "2026, LSSTDESC"
author = "LSSTDESC"
release = "0.1.0"

# -- General configuration ---------------------------------------------------
extensions = [
    "myst_parser",          # lets you also write pages in Markdown if you want
]

# File types Sphinx will recognise as source documents
source_suffix = {
    ".rst": "restructuredtext",
    ".md":  "markdown",
}

templates_path = ["_templates"]
exclude_patterns = []

# The root document (the "homepage" of your docs)
root_doc = "index"

# -- Options for HTML output -------------------------------------------------
html_theme = "sphinx_rtd_theme"          # Read-the-Docs theme
html_static_path = ["_static"]

# Optional: put a logo in _static/ and reference it here
html_logo = "_static/desc_logo.png"

# Optional: custom CSS tweaks
html_css_files = [
    'css/custom.css',
]
