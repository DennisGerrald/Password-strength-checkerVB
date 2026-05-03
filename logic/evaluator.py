import re
import math

def evaluate_password(password):
    length = len(password)
    
    # Regex checks
    has_lower = bool(re.search(r'[a-z]', password))
    has_upper = bool(re.search(r'[A-Z]', password))
    has_number = bool(re.search(r'\d', password))
    has_symbol = bool(re.search(r'[^a-zA-Z0-9]', password))
    
    # Calculate pool size (R)
    pool_size = 0
    feedback = []
    
    if has_lower:
        pool_size += 26
        feedback.append({"pattern": r"/[a-z]/", "match": True, "desc": "Lowercase (26 chars)"})
    else:
        feedback.append({"pattern": r"/[a-z]/", "match": False, "desc": "Missing lowercase"})
        
    if has_upper:
        pool_size += 26
        feedback.append({"pattern": r"/[A-Z]/", "match": True, "desc": "Uppercase (26 chars)"})
    else:
        feedback.append({"pattern": r"/[A-Z]/", "match": False, "desc": "Missing uppercase"})
        
    if has_number:
        pool_size += 10
        feedback.append({"pattern": r"/\d/", "match": True, "desc": "Numbers (10 chars)"})
    else:
        feedback.append({"pattern": r"/\d/", "match": False, "desc": "Missing numbers"})
        
    if has_symbol:
        pool_size += 32
        feedback.append({"pattern": r"/[^a-zA-Z0-9]/", "match": True, "desc": "Symbols (32 chars)"})
    else:
        feedback.append({"pattern": r"/[^a-zA-Z0-9]/", "match": False, "desc": "Missing symbols"})
        
    # Calculate Entropy and Brute Force Time
    entropy = 0
    crack_time = "Instantly"
    if pool_size > 0 and length > 0:
        entropy = length * math.log2(pool_size)
        combinations = pool_size ** length
        # Assume 100 Billion guesses per second (modern offline attack)
        guesses_per_second = 100_000_000_000
        seconds = combinations / guesses_per_second
        
        if seconds < 1:
            crack_time = "Instantly"
        elif seconds < 60:
            crack_time = f"{int(seconds)} seconds"
        elif seconds < 3600:
            crack_time = f"{int(seconds / 60)} minutes"
        elif seconds < 86400:
            crack_time = f"{int(seconds / 3600)} hours"
        elif seconds < 31536000:
            crack_time = f"{int(seconds / 86400)} days"
        elif seconds < 3153600000:
            crack_time = f"{int(seconds / 31536000)} years"
        elif seconds < 315360000000:
            crack_time = f"{int(seconds / 3153600000)} centuries"
        else:
            crack_time = "Millions of years"
        
    # Strength Rating
    if entropy == 0:
        strength = "None"
        color = "var(--color-bg-light)"
        width = 0
    elif entropy < 28:
        strength = "Very Weak"
        color = "var(--color-danger)"
        width = min((entropy / 128) * 100, 20)
    elif entropy < 36:
        strength = "Weak"
        color = "var(--color-warning)"
        width = min((entropy / 128) * 100, 40)
    elif entropy < 60:
        strength = "Reasonable"
        color = "var(--color-info)"
        width = min((entropy / 128) * 100, 60)
    elif entropy < 128:
        strength = "Strong"
        color = "var(--color-success)"
        width = min((entropy / 128) * 100, 80)
    else:
        strength = "Very Strong"
        color = "var(--color-success-bright)"
        width = 100
        
    return {
        "length": length,
        "pool_size": pool_size,
        "entropy": round(entropy, 2),
        "crack_time": crack_time,
        "strength": strength,
        "color": color,
        "width": width,
        "feedback": feedback
    }
