import sys
from cx_Freeze import setup, Executable

# Dependencies are automatically detected, but it might need fine tuning.
build_exe_options = {"packages": ["os", "tkinter", "PIL", "socket"], "include_files": ["connected.png", "disconnected.png"]}

# GUI applications require a different base on Windows (the default is for a console application).
base = None
if sys.platform == "win32":
    base = "Win32GUI"

setup(
    name="Internet Connection Checker",
    version="0.1",
    description="Check internet connectivity",
    options={"build_exe": build_exe_options},
    executables=[Executable("app.py", base=base)]
)
