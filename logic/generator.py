import secrets
import string

def generate_password(length=16, use_upper=True, use_numbers=True, use_symbols=True):
    pool = string.ascii_lowercase
    if use_upper:
        pool += string.ascii_uppercase
    if use_numbers:
        pool += string.digits
    if use_symbols:
        pool += string.punctuation
        
    if not pool:
        return ""
        
    return ''.join(secrets.choice(pool) for _ in range(length))
