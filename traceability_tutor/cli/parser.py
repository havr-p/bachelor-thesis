import argparse

parser = argparse.ArgumentParser(prog='ttutor', description='Requirement traceability tutor')
parser.add_argument(
            "-v", "--version", action="version", version='0.0.1'
        )

args = parser.parse_args()
