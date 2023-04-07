import tkinter as tk
from tkinter import filedialog
import os
from utils.aes import generate_key, encrypt_file, generate_random_string
from utils.boomerang import get_boomerang_info

class App(tk.Frame):
    def __init__(self, master=None):
        super().__init__(master)
        self.master = master
        self.master.title("Boomerang Encoder")
        self.master.geometry("600x800")
        self.pack()

        self.file_path = tk.StringVar()
        self.output_path = tk.StringVar()
        self.boomerang = tk.IntVar()
        self.create_widgets()

    def create_widgets(self):



        # Create label to display Instructions 
        self.instructions_label_one = tk.Label(self, text="Select File to Encrypt", wraplength=350)
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
        self.instructions_label_three = tk.Label(self, text="Select Boomerang", wraplength=350)
        self.instructions_label_three.pack(side="top", pady=10)


        self.number_entry = tk.Entry(self)
        self.number_entry.pack()

        self.submit_button = tk.Button(self, text="Display Number", command=self.select_number)
        self.submit_button.pack()


        # Create label to display selected output folder
        self.boomerang_label = tk.Label(self, text="", wraplength=350)
        self.boomerang_label.pack(side="top", pady=10)

        # Create zip button
        self.zip_button = tk.Button(self, text="Encrypt", command=self.encrypt_file, state="disabled")
        self.zip_button.pack(side="top", pady=10)

        # Create status label
        self.status_label = tk.Label(self, text="", fg="red")
        self.status_label.pack(side="top", pady=10)



    def select_file(self):
        # Open file dialog to select file
        file_selected = filedialog.askopenfilename()

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
            self.submit_button["state"] = "normal"


    def select_number(self):
        number = self.number_entry.get()
        if number:
            self.boomerang = number
            try:
                info = get_boomerang_info(int(number))

                self.boomerang_label["text"] = f"Boomerang selected: {number}, Expiry Time: {info['expiry_time']}, Update Frequency: {info['update_frequency']}"

                self.zip_button["state"] = "normal"


                print(info)
            except Exception as e:
                print(e)
                self.boomerang_label["text"] = f"Boomerang not found!"

    # This should encrypt file, and store boomerang details in file!
    def encrypt_file(self):

        try:
            # Get selected file path and output folder path
            file_path = self.file_path.get()
            output_path = self.output_path.get()
            # Get base name of file
            file_name = os.path.basename(file_path)


            # Generate password
            password = generate_random_string()
            key = generate_key(password)
            encrypt_file(file_path, f"{output_path}/{file_name}.enc", key)


            # Show success message and clear inputs
            self.status_label["text"] = f"{file_name}.enc created successfully."
            self.status_label["fg"] = "green"
            self.file_path.set("")
            self.output_path.set("")
            self.file_label["text"] = f""
            self.output_button["state"] = "disabled"
            self.output_label["text"] = f""
            self.zip_button["state"] = "disabled"

        except Exception as e:
            # Show error message
            self.status_label["text"] = f"Error creating archive: {e}"
            self.status_label["fg"] = "red"


root = tk.Tk()
app = App(master=root)
app.mainloop()
