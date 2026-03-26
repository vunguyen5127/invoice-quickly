import os
import re

def get_keys(content):
    pattern = re.compile(r'^\s*([a-zA-Z0-9_]+)\s*:', re.MULTILINE)
    return set(pattern.findall(content))

def main():
    root = os.path.dirname(os.path.abspath(__file__))
    locales_dir = os.path.join(root, 'locales')
    with open(os.path.join(locales_dir, 'en.ts'), 'r', encoding='utf-8') as f:
        en_content = f.read()
    
    en_keys = get_keys(en_content)
    en_keys.discard('export')
    en_keys.discard('type')
    en_keys.discard('Translations')
    en_keys.discard('K')
    
    files = [f for f in os.listdir(locales_dir) if f.endswith('.ts') and f not in ('en.ts')]
    
    for filename in files:
        with open(os.path.join(locales_dir, filename), 'r', encoding='utf-8') as f:
            content = f.read()
        target_keys = get_keys(content)
        missing = en_keys - target_keys
        if missing:
            print(f"{filename}: {len(missing)} missing keys")
        else:
            print(f"{filename} OK")

if __name__ == "__main__":
    main()
