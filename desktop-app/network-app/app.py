import tkinter as tk
from PIL import Image, ImageTk
import socket



class App(tk.Frame):
    def __init__(self, master=None):
        super().__init__(master)
        self.master = master
        self.master.title("Internet Connection Checker")
        self.master.geometry("350x200")
        self.pack()

        # Create image objects for connected and disconnected states
        self.connected_image = ImageTk.PhotoImage(Image.open("connected.png").resize((30,30)))
        self.disconnected_image = ImageTk.PhotoImage(Image.open("disconnected.png").resize((30,30)))

        # Create label for displaying the image
        self.image_label = tk.Label(self, image=self.disconnected_image)
        self.image_label.pack(pady=10)

        # Create label for explaining the program
        self.info_label = tk.Label(self, text=f"Checking for internet connection every {REFRESH_INTERVAL} seconds")
        self.info_label.pack(pady=5)

        # Create label for explaining the program
        self.status_label = tk.Label(self, text=f"Testing connection...")
        self.status_label.pack(pady=5)


        # Check internet connection status
        self.check_internet_connection()
    def _check_internet_connection(self):
        self.status_label["text"] = "Testing"
        try:
            host = socket.gethostbyname('dns.google')
            s = socket.create_connection((host, 80), 2)
            return True
        except:
            return False

    def check_internet_connection(self):
        if self._check_internet_connection():
            self.image_label.config(image=self.connected_image)
            self.status_label["text"] = "Connected"
        else:
            self.image_label.config(image=self.disconnected_image)
            self.status_label["text"] = "Disconnected"


        # Schedule the function to run again after REFRESH_INTERVAL seconds
        self.master.after(REFRESH_INTERVAL*1000, self.check_internet_connection)


# Refresh interval in seconds
REFRESH_INTERVAL = 5

root = tk.Tk()
app = App(master=root)
app.mainloop()
