# -*- coding: utf-8 -*-
#!/usr/bin/python
from bottle import route, request, run, default_app
import os,sys

@route('/upload')
def fileselect():
    return '''
    <form action="/upload" method="post" enctype="multipart/form-data">
    Select: <input type="file" name="upload" multiple />
    <input type="submit" value="Upload" />
    </form>
    '''

@route('/upload', method='POST')
def do_upload():
    category = request.forms.get('category')
    #upload     = request.files.get('upload')
    uploads = request.files.getall('upload')
    if len(uploads) == 0:
        print('no file selected')
        return
    for upload in uploads:
        print(upload.filename)
        name, ext = os.path.splitext(upload.filename)
        if ext not in ('.jpg', '.JPG', '.jpeg', '.JPEG', '.bmp', '.png', '.PNG', '.gif', '.GIF'):
            return 'File extension not allowed.'
        #save_path = get_save_path_for_category(category)
        save_path = "/mnt/photos/"
        upload.save(save_path, overwrite=True) # appends upload.filename automatically
    return 'OK'

if __name__ == '__main__':
    run(host='0.0.0.0', port=int(sys.argv[1] if len(sys.argv) > 1 else 80))
else:
    application = default_app()
