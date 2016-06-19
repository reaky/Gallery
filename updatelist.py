#!/usr/bin/env python
#coding=utf-8

import string, os, sys, json, glob
from PIL import Image
from PIL import ImageFile
import pyexiv2
from pyinotify import WatchManager, Notifier, ProcessEvent, IN_DELETE, IN_CREATE, IN_MODIFY, IN_CLOSE_WRITE

ImageFile.LOAD_TRUNCATED_IMAGES = True
photolist = []

def make_thumb(path, size=200):
    try:
        im = Image.open(path)
    except IOError:
        return
    mode = im.mode
    if mode not in ('L', 'RGB'):
        if mode == 'RGBA':
            alpha = im.split()[3]
            bgmask = alpha.point(lambda x: 255-x)
            im = im.convert('RGB')
            # paste(color, box, mask)
            im.paste((255,255,255), None, bgmask)
        else:
            im = im.convert('RGB')
            
    width, height = im.size
    if width == height:
        region = im
    else:
        if width > height:
            delta = (width - height)/2
            box = (delta, 0, delta+height, height)
        else:
            delta = (height - width)/2
            box = (0, delta, width, delta+width)            
        region = im.crop(box)
            
    base, ext = os.path.splitext(os.path.basename(path))
    path_thumb = os.path.join(os.path.dirname(path), 'thumb', '%s_thumb%s'%(base, ext))
    if not os.path.isfile(path_thumb):
        thumb = region.resize((size,size), Image.ANTIALIAS)
        thumb.save(path_thumb, quality=100)

        metadata = pyexiv2.ImageMetadata(path)
        metadata.read()
        metadata_thumb = pyexiv2.ImageMetadata(path_thumb)
        metadata_thumb.read()
        if 'Exif.Photo.PixelXDimension' not in metadata.exif_keys:
            os.remove(path)
            os.remove(path_thumb)
            return "failed"
        #print(metadata.exif_keys)
        metadata_thumb['Exif.Photo.PixelXDimension']=pyexiv2.ExifTag('Exif.Photo.PixelXDimension', metadata['Exif.Photo.PixelXDimension'].value)
        metadata_thumb['Exif.Photo.PixelYDimension']=pyexiv2.ExifTag('Exif.Photo.PixelYDimension', metadata['Exif.Photo.PixelYDimension'].value)
        metadata_thumb.write()

        metadata_thumb = pyexiv2.ImageMetadata(path_thumb)
        metadata_thumb.read()
        print("%s x %s"%(metadata_thumb['Exif.Photo.PixelXDimension'].value, metadata_thumb['Exif.Photo.PixelYDimension'].value))
    return "success"

def update_list(directory='./photos', ACTION='init', item=''):
    if ACTION == 'init':
        #files = os.listdir(directory)  
        #files = glob.glob(os.path.join(directory, '*.jpg'))  
        files = [fn for fn in os.listdir(directory)
            if any(fn.endswith(ext) for ext in ['jpg', 'JPG', 'jpeg', 'JPEG', 'bmp', 'png', 'gif'])]
        for f in files:  
            print(os.path.join(directory, f))
            if "success" == make_thumb(os.path.join(directory, f)):
                im = Image.open(os.path.join(directory, f))
                print(im.format, im.size, im.mode)
                photolist.insert(0, f)
    elif ACTION == 'add':
        if "success" == make_thumb(os.path.join(directory, item)):
            im = Image.open(os.path.join(directory, item))
            print(im.format, im.size, im.mode)
            photolist.insert(0, item)
    elif CTION == 'delete':
        photolist.remove(item)
    else:
        pass

    print(json.dumps(photolist))
    fileHandle = open ( 'list.json', 'w' )
    fileHandle.write (json.dumps(photolist))  
    fileHandle.close()

def monitor_photos(directory='./photos'):
    lastmodifytime = 0
    wm = WatchManager() 
    # watched events
    mask = IN_DELETE | IN_CREATE |IN_MODIFY | IN_CLOSE_WRITE

    class PFilePath(ProcessEvent):
        def process_IN_CREATE(self, event):
            print("Create file: %s " %   os.path.join(event.path, event.name))

        def process_IN_CLOSE_WRITE(self, event):
            print("Close file: %s " %   os.path.join(event.path, event.name))
            update_list(directory, 'add', event.name)

        def process_IN_DELETE(self, event):
            print("Delete file: %s " %   os.path.join(event.path, event.name))
            update_list(directory, 'delete', event.name)

        def process_IN_MODIFY(self, event):
            print("Modify file: %s " %   os.path.join(event.path, event.name))

    notifier = Notifier(wm, PFilePath())
    wdd = wm.add_watch(directory, mask, rec=True)

    while True:
        try:
            notifier.process_events()
            if notifier.check_events():
                notifier.read_events()
        except KeyboardInterrupt:
            notifier.stop()
            break

if __name__ == '__main__':
    directory='./photos'
    #make_thumb(r"./photos/IMG_1386.JPG")
    update_list(directory, 'init')
    monitor_photos(directory)
