import subprocess
import cv2
import os
import sys
from ultralytics import YOLO

model = sys.argv[1] # /Users/austin/Desktop/bubble-detection/yolov5/runs/detect/train/weights/best.pt
conf = float(sys.argv[2]) # 0.25
source = sys.argv[3] # /Users/austin/Desktop/bubble-detection/images
project = sys.argv[4]
name = sys.argv[5]

def run_yolo_command(model, conf, source, project, name):
    model = YOLO(model)
    # yolo_command = f'yolo task=detect mode=predict model={model} conf={conf} source={source} project={project} name={name} save'
    results = model.predict(source=source, conf=conf, save=True, project=project, name=name, save_txt=True, verbose=False)
    print(results[-1])


# Example usage
# def run():
#     try:
#         output = subprocess.check_output(run_yolo_command(model, conf, source, project, name), shell=True, stderr=subprocess.STDOUT)
#         print("YOLO command output:", output.decode("utf-8"))
#         result_path = output.decode("utf-8").split(" ")[-1]
#         print(result_path)
        
#     #     # Process the output as needed
#     except subprocess.CalledProcessError as e:
#         print("Error executing YOLO command:", e.output.decode("utf-8"))
#         # Handle the error

run_yolo_command(model, conf, source, project, name)
print("Script completed")