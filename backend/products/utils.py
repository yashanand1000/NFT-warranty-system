import requests
import os
from django.conf import settings
import cv2


def serialize_image(image_path, text, item):
    image = cv2.imread(image_path)
    cv2.putText(image, text, (10, image.shape[0] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
    # save and upload image to ipfs
    file_name = text + os.path.basename(image_path)
    image_dir = os.path.join(settings.MEDIA_ROOT, 'items/')
    if not os.path.exists(image_dir):
        os.makedirs(image_dir)
    file_path = os.path.join(image_dir, file_name)
    cv2.imwrite(file_path, image)
    image_ipfs_hash = upload_file_to_ipfs(file_path)
    metadata = {
        "name": item.product.name,
        "serialNo": item.serial_no,
        "retailer": item.product.retailer.first_name + ' ' + item.product.retailer.last_name,
        "warranty_period": item.product.warranty_period,
        "image": image_ipfs_hash,
        "description": item.product.product_data,
        "created_at": item.created_at.strftime("%Y-%m-%d %H:%M:%S"),
    }
    ipfs_hash = upload_json_to_ipfs(metadata)
    return ipfs_hash, os.path.join("items/", file_name)


def upload_file_to_ipfs(file_path):
    header = {'Authorization': 'Bearer ' + settings.PINATA_JWT_SECRET}
    url = settings.PINATA_API_URL + '/pinning/pinFileToIPFS'
    file = {'file': open(file_path, 'rb')}
    response = requests.post(url, headers=header, files=file)
    return response.json()['IpfsHash']


def upload_json_to_ipfs(metadata):
    header = {'Authorization': 'Bearer ' + settings.PINATA_JWT_SECRET}
    url = settings.PINATA_API_URL + '/pinning/pinJSONToIPFS'
    response = requests.post(url, headers=header, json=metadata)
    return response.json()['IpfsHash']
