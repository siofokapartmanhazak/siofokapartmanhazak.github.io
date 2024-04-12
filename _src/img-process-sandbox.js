const sharp = require('sharp')
const fs = require('fs-extra')

const CWD = process.cwd()
const ROOT = process.cwd() + '/_DUMP_RESIZE_IN'

function consolidateSizes(path){
    const entries = fs.readdirSync(path, {withFileTypes:true})
    for(const entry of entries){
        if(entry.isDirectory()){
            consolidateSizes(path + "/" + entry.name)
        }else{
            const _file_path = entry.path + "/" + entry.name 
            const _new_dir_path = entry.path.replace("_DUMP_RESIZE", "_DUMP_RESIZE_2")
            fs.mkdirSync(_new_dir_path, {recursive:true})
            const _new_file_path = _new_dir_path + "/" + entry.name 
            sharp(_file_path)
              .resize(1920, undefined, {withoutEnlargement:true})
              .toFile(_new_file_path)
            //   .then( data => {console.log(data)})
              .catch( err => {console.error(err)});
        }
    }
    
}
// consolidateSizes(ROOT)


function consolidateGalleryFileNames(path){
    const entries = fs.readdirSync(path, {withFileTypes:true})
    for(const entry of entries){
        if(entry.isDirectory()){
            if(entry.name == "gallery"){
                for(const [i,galleryImg] of fs.readdirSync(entry.path + "/" + entry.name, {withFileTypes:true}).entries()){
                    const fullPathOriginal = galleryImg.path + "/" + galleryImg.name
                    const fileExt = fullPathOriginal.split(".").pop()


                    const fullPathNew = galleryImg.path + "/" + String(i).padStart(2,"0") + "." + fileExt
                    console.log(fullPathOriginal, fullPathNew)
                    fs.renameSync(fullPathOriginal, fullPathNew)

                }
            }else{
                consolidateGalleryFileNames(path + "/" + entry.name)
            }
        }
    }
}
// consolidateGalleryFileNames(CWD + "/static/img")

function lowercaseExtensions(path){
    const entries = fs.readdirSync(path, {withFileTypes:true})
    for(const entry of entries){
        if(entry.isDirectory()){
            lowercaseExtensions(path + "/" + entry.name)
        }
        else{
            const _file_path = entry.path + "/" + entry.name
            const split = _file_path.split(".")
            const extension = split.pop() 
            const entryPathWithoutExtension = split.join(".") 
            const lowercaseExtension = extension.toLowerCase()
            const _new_file_path = entryPathWithoutExtension + "." + lowercaseExtension
            if(_new_file_path != _file_path) {
                console.log(_new_file_path, _file_path)
                fs.renameSync(_file_path, _new_file_path)
            }else{
                console.log(_new_file_path, _file_path)
            } 
        }
    }
}

// lowercaseExtensions(CWD + "/static/img")



function makeThumbnails(path){
    const entries = fs.readdirSync(path, {withFileTypes:true})
    for(const entry of entries){
        if(entry.isDirectory()){
            makeThumbnails(path + "/" + entry.name)
        }
        else{
            const _file_path = entry.path + "/" + entry.name
            const split = _file_path.split(".")
            const extension = split.pop() 
            const entryPathWithoutExtension = split.join(".") 
            const _new_file_path_L = entryPathWithoutExtension + "-thumb-960" + "." + extension 
            const _new_file_path_S = entryPathWithoutExtension + "-thumb-480" + "." + extension 
            sharp(_file_path)
            .resize(960, null, {withoutEnlargement:true})
            .toFile(_new_file_path_L)
            //   .then( data => {console.log(data)})
            .catch( err => {console.error(err)});

            sharp(_file_path)
            .resize(480, null, {withoutEnlargement:true})
            .toFile(_new_file_path_S)
            //   .then( data => {console.log(data)})
            .catch( err => {console.error(err)});
        }
    }
}

makeThumbnails(CWD + "/static/img")

