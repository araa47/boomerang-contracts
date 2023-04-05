import tkinter as tk
from tkinter import ttk
from tkinter import filedialog
import gzip
import shutil
import os


class App(tk.Frame):
    def __init__(self, master=None):
        super().__init__(master)
        self.master = master
        self.master.title("Boomerang ED")
        self.master.geometry("500x400")
        self.pack()

        self.folder_path = tk.StringVar()
        self.output_path = tk.StringVar()
        self.create_widgets()

    def create_widgets(self):
        # Create folder selection button
        self.folder_button = tk.Button(self, text="Select Folder to GZIP", command=self.select_folder)
        self.folder_button.pack(side="top", pady=10)

        # Create label to display selected folder
        self.folder_label = tk.Label(self, text="Please select a folder to zip.", wraplength=350)
        self.folder_label.pack(side="top", pady=10)

        # Create output folder selection button
        self.output_button = tk.Button(self, text="Select Output Folder", command=self.select_output_folder, state="disabled")
        self.output_button.pack(side="top", pady=10)

        # Create label to display selected output folder
        self.output_label = tk.Label(self, text="Please select a folder to save the zipped file.", wraplength=350)
        self.output_label.pack(side="top", pady=10)

        # Create zip button
        self.zip_button = tk.Button(self, text="Zip", command=self.zip_folder, state="disabled")
        self.zip_button.pack(side="top", pady=10)

        # Create status label
        self.status_label = tk.Label(self, text="", fg="red")
        self.status_label.pack(side="top", pady=10)

        # Create progress bar
        self.progress_bar = ttk.Progressbar(self, orient="horizontal", length=200, mode="determinate")
        self.progress_bar.pack(side="top", pady=10)

    def select_folder(self):
        # Open file dialog to select folder
        folder_selected = filedialog.askdirectory()

        if folder_selected:
            self.folder_path.set(folder_selected)
            self.folder_label["text"] = f"Folder selected: {folder_selected}"
            self.output_button["state"] = "normal"

    def select_output_folder(self):
        # Open file dialog to select output folder
        output_selected = filedialog.askdirectory()

        if output_selected:
            self.output_path.set(output_selected)
            self.output_label["text"] = f"Output folder selected: {output_selected}"
            self.zip_button["state"] = "normal"

    def zip_folder(self):
        try:
            # Get selected folder path and output folder path
            folder_path = self.folder_path.get()
            output_path = self.output_path.get()

            # Get base name of folder
            folder_name = os.path.basename(folder_path)

            # Compress the contents of the folder using gzip
            total_size = sum(os.path.getsize(os.path.join(root, name)) for root, dirs, files in os.walk(folder_path) for name in files)
            bytes_so_far = 0
            with gzip.open(os.path.join(output_path, f"{folder_name}.gz"), "wb") as f_out:
                for root, dirs, files in os.walk(folder_path):
                    for file in files:
                        file_path = os.path.join(root, file)
                        with open(file_path, "rb") as f_in:
                            shutil.copyfileobj(f_in, f_out)

                            # Update progress bar
                            bytes_so_far += os.path.getsize(file_path)
                            percent_done = int((bytes_so_far / total_size) * 100)
                            self.progress_bar["value"] = percent_done
                            self.progress_bar.update()

            # Show success message and clear inputs
            self.status_label["text"] = f"{folder_name}.gz created successfully."
            self.status_label["fg"] = "green"
            self.folder_path.set("")
            self.output_path.set("")
            self.folder_label["text"] = f""
            self.output_button["state"] = "normal"
            self.output_label["text"] = f""
            self.zip_button["state"] = "disabled"

        except Exception as e:
            # Show error message
            self.status_label["text"] = f"Error creating archive: {e}"
            self.status_label["fg"] = "red"


root = tk.Tk()
app = App(master=root)
app.mainloop()
