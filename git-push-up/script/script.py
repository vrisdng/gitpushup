import cv2
import time
import sys

def main():
    if len(sys.argv) <= 1:
        print("No argument provided")
        return
    random_string = sys.argv[1]
    for i in range(20):
        print(f"{random_string} {i}", flush=True)  # flush=True is important
        time.sleep(1)

if __name__ == "__main__":
    main()
