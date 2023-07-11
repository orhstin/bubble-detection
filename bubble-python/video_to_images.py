import cv2
from datetime import timedelta
import numpy as np
import os
import sys

MAX_FRAMES_PER_SECOND = 10

def format_timedelta(td):
    result = str(td)
    try:
        result, ms = result.split(".")
    except ValueError:
        return (result + ".00").replace(":", "-")
    ms = int(ms)
    ms = round(ms / 1e4)
    return f"{result}.{ms:02}".replace(":","-")

def get_saving_frames_durations(cap, saving_fps):
    s = []
    clip_duration = cap.get(cv2.CAP_PROP_FRAME_COUNT) / cap.get(cv2.CAP_PROP_FPS)

    for i in np.arange(0, clip_duration, 1/saving_fps):
        s.append(i)
    
    return s

def video_into_frames(video_file, filename):
    folder_name = '/Users/austin/Desktop/bubble-detection/bubble-python/images/' + filename
    if not os.path.exists(folder_name):
        os.makedirs(folder_name)
    
    cap = cv2.VideoCapture(video_file)
    fps = cap.get(cv2.CAP_PROP_FPS)
    saving_frames_per_second = min(fps, MAX_FRAMES_PER_SECOND)
    saving_frames_duration = get_saving_frames_durations(cap, saving_frames_per_second)

    count = 0
    while True:
        is_read, frame = cap.read()
        if not is_read:
            break
            
        frame_duration = count/fps
        try:
            closest_duration = saving_frames_duration[0]
        except IndexError:
            break

        if frame_duration >= closest_duration:
            frame_duration_formatted = format_timedelta(timedelta(seconds=frame_duration))
            cv2.imwrite(os.path.join(folder_name, f"{filename}-{frame_duration_formatted}.jpg"), frame)
            try:
                saving_frames_duration.pop(0)
            except IndexError:
                pass
        
        count += 1


video_file = sys.argv[1]
filename = sys.argv[2]

# video_file = '/Users/austin/Desktop/bubble-detection/bubble-app/dist/resources/static/assets/uploads/20210502-102234.95.mp4'
# filename = '20210502-102234.95.mp4'
video_into_frames(video_file, filename)
print("Video into frames completed")