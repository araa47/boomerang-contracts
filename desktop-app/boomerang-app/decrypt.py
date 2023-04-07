import tkinter as tk
from tkinter import filedialog
import os
from utils.aes import decrypt_file
from utils.boomerang import get_boomerang_info


class App(tk.Frame):
    def __init__(self, master=None):
        super().__init__(master)
        self.master = master
        self.master.title("Boomerang Decoder")
        self.master.geometry("600x800")
        self.pack()

        self.file_path = tk.StringVar()
        self.output_path = tk.StringVar()
        self.boomerang = tk.IntVar()
        self.create_widgets()
        self.flip = False 

    def create_widgets(self):



        # Create label to display Instructions 
        self.instructions_label_one = tk.Label(self, text="Select .enc File to Decrypt", wraplength=350)
        self.instructions_label_one.pack(side="top", pady=10)

        # Create folder selection button
        self.file_button = tk.Button(self, text="Browse", command=self.select_file)
        self.file_button.pack(side="top", pady=10)

        self.file_label = tk.Label(self, text="", wraplength=350)
        self.file_label.pack(side="top", pady=10)


        # Create label to display Instructions 
        self.instructions_label_two = tk.Label(self, text="Select Output Directory", wraplength=350)
        self.instructions_label_two.pack(side="top", pady=10)

      # Create output folder selection button
        self.output_button = tk.Button(self, text="Browse", command=self.select_output_folder, state="disabled")
        self.output_button.pack(side="top", pady=10)


        # Create label to display selected output folder
        self.output_label = tk.Label(self, text="", wraplength=350)
        self.output_label.pack(side="top", pady=10)
        


        # Create label to display Instructions 
        self.instructions_label_three = tk.Label(self, text="Click button below to check boomerang status", wraplength=350)
        self.instructions_label_three.pack(side="top", pady=10)

        # Create check folder selection button
        self.check_button = tk.Button(self, text="Check", command=self.check_boomerang, state="disabled")
        self.check_button.pack(side="top", pady=10)
        # self.number_entry = tk.Entry(self)
        # self.number_entry.pack()

        # self.submit_button = tk.Button(self, text="Display Number", command=self.select_number)
        # self.submit_button.pack()


        # Create label to display selected output folder
        self.boomerang_label = tk.Label(self, text="", wraplength=350)
        self.boomerang_label.pack(side="top", pady=10)

        # # Create zip button
        # self.zip_button = tk.Button(self, text="Encrypt", command=self.zip_file, state="disabled")
        # self.zip_button.pack(side="top", pady=10)

        # # Create status label
        # self.status_label = tk.Label(self, text="", fg="red")
        # self.status_label.pack(side="top", pady=10)

        # # Create progress bar
        # self.progress_bar = ttk.Progressbar(self, orient="horizontal", length=200, mode="determinate")
        # self.progress_bar.pack(side="top", pady=10)

    def select_file(self):
        # Open file dialog to select file
        filetypes = [("Encrypted Files", "*.enc")]
        file_selected = filedialog.askopenfilename(filetypes=filetypes)

        if file_selected:
            self.file_path.set(file_selected)
            self.file_label["text"] = f"File selected: {file_selected}"
            self.output_button["state"] = "normal"

    def select_output_folder(self):
        # Open file dialog to select output folder
        output_selected = filedialog.askdirectory()

        if output_selected:
            self.output_path.set(output_selected)
            self.output_label["text"] = f"Output folder selected: {output_selected}"
            self.check_button["state"] = "normal"

    def check_boomerang(self):
        id = 0 
        info = get_boomerang_info(id)

        print(info)

        # TODO clean this logic 

        if self.flip:
            self.boomerang_label["text"] = f"Boomerang locked, come back in 2 hours!"
        else:
            file_path = self.file_path.get()
            # Get base name of file
            file_name = os.path.basename(file_path)
            file_path = self.file_path.get()
            output_path = self.output_path.get()

            decrypt_file(file_path, f"{output_path}/{file_name[:-4]}")



            self.boomerang_label["text"] = f"Boomerang unlocked, decrypting file: {file_name[:-4]}!"

        self.flip = not self.flip

    def select_number(self):
        number = self.number_entry.get()
        if number:
            self.boomerang = number
            self.boomerang_label["text"] = f"Boomerang selected: {number}"
            self.zip_button["state"] = "normal"




root = tk.Tk()
app = App(master=root)
app.mainloop()
