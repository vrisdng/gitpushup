import cv2
import mediapipe as md
import numpy as np
import cvzone
import time
import sys

md_drawing = md.solutions.drawing_utils
# md_drawing_styles = md.solutions.drawing_styles
md_pose = md.solutions.pose

# position=None
camera_indices = [0, 1]
for idx in camera_indices:
    cap = cv2.VideoCapture(idx)
    if cap.isOpened():
        print(f"Index {idx}")
        break
    else:
        continue 

TARGET = 5

def main():
    global TARGET
    if len(sys.argv) <= 2:
        print("Insufficient argument provided")
        return
    random_string = sys.argv[1]
    TARGET = int(sys.argv[2])
    pushup_counter(random_string)

def pushup_counter(random_string: str):
    last_count = 0
    count = 0
    color = (0, 0, 255)
    dir = 0
    with md_pose.Pose(
        min_detection_confidence = 0.7, 
        min_tracking_confidence = 0.7) as pose:
        while cap.isOpened():
            success,image = cap.read()
            if not success:
                print("No camera detected")
                break

            frame_height, frame_width, _ = image.shape

            image = cv2.cvtColor(cv2.flip(image, 1), cv2.COLOR_BGR2RGB)
            result = pose.process(image)

            imlist = []

            if result.pose_landmarks:
                md_drawing.draw_landmarks(
                    image, result.pose_landmarks, md_pose.POSE_CONNECTIONS)
                for id,im in enumerate(result.pose_landmarks.landmark):
                    if len(image.shape) == 3:
                        h, w, _ = image.shape  
                    else:
                        h, w = image.shape 
                    X,Y = int(im.x*w), int(im.y*h)
                    imlist.append([id,X,Y])
                
            if len(imlist) != 0:
                angle_left = imlist[14][2] - imlist[12][2]
                angle_right = imlist[13][2] - imlist[11][2]

                # Map angles to percentage values
                percentage_right = int(np.interp(angle_right, (85, 165), (100, 0)))
                percentage_left = int(np.interp(angle_left, (85, 165), (100, 0)))

                bar_height = int(0.5 * frame_height)  # Dynamic bar height
                bar_top = int(0.1 * frame_height)    # Bar top position
                bar_width = int(0.05 * frame_width)  # Bar width
                left_bar_x = int(0.1 * frame_width)
                right_bar_x = int(0.85 * frame_width)

                bar_val_right = int(np.interp(percentage_right, (0, 100), (bar_top + bar_height, bar_top)))
                bar_val_left = int(np.interp(percentage_left, (0, 100), (bar_top + bar_height, bar_top)))

                # Draw progress bars for left and right arms
                cv2.rectangle(image, (left_bar_x, bar_val_left), (left_bar_x + bar_width, bar_top + bar_height), color, cv2.FILLED)
                cv2.rectangle(image, (left_bar_x, bar_top), (left_bar_x + bar_width, bar_top + bar_height), (0, 0, 0), 3)

                cv2.rectangle(image, (right_bar_x, bar_val_right), (right_bar_x + bar_width, bar_top + bar_height), color, cv2.FILLED)
                cv2.rectangle(image, (right_bar_x, bar_top), (right_bar_x + bar_width, bar_top + bar_height), (0, 0, 0), 3)

                # Display percentages in the center of progress bars
                cvzone.putTextRect(image, f'{percentage_left} %', 
                                (left_bar_x + bar_width // 2 - 20, bar_top - 20), 
                                1.1, 2, colorT=(255, 255, 255), colorR=color, border=2)
                cvzone.putTextRect(image, f'{percentage_right} %', 
                                (right_bar_x + bar_width // 2 - 20, bar_top - 20), 
                                1.1, 2, colorT=(255, 255, 255), colorR=color, border=2)

                # Check push-up conditions
                if percentage_right == 100 and percentage_left == 100:
                    if dir == 0:
                        count += 0.5
                        dir = 1
                        color = (0, 255, 0)  # Green
                elif percentage_right == 0 and percentage_left == 0:
                    if dir == 1:
                        count += 0.5
                        dir = 0
                        color = (0, 255, 0)  # Green
                else:
                    color = (0, 0, 255)  # Blue
                
                # Interact with extension
                if int(count) > last_count:
                    print(f"{random_string} {last_count}")
                    last_count += 1

                # Display push-up count
            cvzone.putTextRect(image, f'Push-ups: {int(count)}', (frame_width // 2 - 100, 50), 2, 2, colorT=(255, 255, 255), colorR=(255, 0, 0), border=2)

            display_image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
            cv2.imshow("Push-up counter", display_image)
            key = cv2.waitKey(1)
            if key == ord('q'): break
            if last_count == TARGET: break

    cap.release()

if __name__ == "__main__":
    main()
