import os
import hashlib
import secrets
import string


from Crypto.Cipher import AES

# Define the header format for the encrypted file
HEADER_FORMAT = "16s"

def generate_key(password):
    # Generate a 256-bit key using the SHA-256 hash of the password
    key = hashlib.sha256(password.encode()).digest()
    return key

def generate_random_string():
    alphabet = string.ascii_letters + string.digits
    random_string = ''.join(secrets.choice(alphabet) for i in range(32))
    return random_string

def encrypt_file(file_path, output_path, key):
    # Create a new AES cipher with CBC mode
    cipher = AES.new(key, AES.MODE_CBC)

    # Read the entire file into memory and pad it with spaces to make it a multiple of 16 bytes
    with open(file_path, "rb") as f_in:
        plaintext = f_in.read()
    if len(plaintext) % 16 != 0:
        plaintext += b' ' * (16 - len(plaintext) % 16)

    # Encrypt the plaintext using the cipher
    ciphertext = cipher.encrypt(plaintext)

    # Write the ciphertext and header to the output file
    with open(output_path, "wb") as f_out:
        # Write the header (the IV)
        f_out.write(cipher.iv)

        # Write the key size and key
        key_size = len(key).to_bytes(2, byteorder="big")
        f_out.write(key_size)
        f_out.write(key)

        # Write the ciphertext
        f_out.write(ciphertext)

def decrypt_file(file_path, output_path):
    # Read the IV and key from the input file
    with open(file_path, "rb") as f_in:
        iv = f_in.read(AES.block_size)
        key_size_bytes = f_in.read(2)
        key_size = int.from_bytes(key_size_bytes, byteorder="big")
        key = f_in.read(key_size)

        # Create a new AES cipher with CBC mode
        cipher = AES.new(key, AES.MODE_CBC, iv)

        # Read the ciphertext from the input file
        ciphertext = f_in.read()

    # Decrypt the ciphertext using the cipher
    plaintext = cipher.decrypt(ciphertext)

    # Remove any padding from the plaintext
    plaintext = plaintext.rstrip(b' ')

    # Write the plaintext to the output file
    with open(output_path, "wb") as f_out:
        f_out.write(plaintext)

# # Generate a key using a password
# password = "hsl"
# key = generate_key(password)

# # Encrypt a file
# input_file = "README.md"
# output_file = "encrypt.enc"
# # encrypt_file(input_file, output_file, key)

# # Decrypt the file
# decrypted_file = "decrypted_app.py"
# decrypt_file(output_file, decrypted_file)
