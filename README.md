# train_ticket_manager

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

分页器
```
components:{
  'Pagination': () => import('@/components/Pagination')
},
```
```
<Pagination 
  ref="pagination" 
  :pageData="paginationList"
  @jumpSize="jumpSize" 
  @jumpPage="jumpPage">
</Pagination>

this.paginationList = res.data.result
```
```
paginationList: {},
per_page: 10,
page: '',
```
```
jumpSize(val){
  this.per_page = val
  this.getData()
},
jumpPage(val){
  this.page = val
  this.getData()
},
```
```
let data = {
  page: this.page || null,
}

/'+this.per_page || null,{params:data}
```


单图片上传
```
 components:{
      'UploadImage': () => import('@/components/UploadLeaflet')
    },

<UploadImage @uploadAddress="uploadImages" ref="uploadImage"></UploadImage>

 uploadImages(val){
   if(val){
     this.upload_image = val
   }
 },

this.$refs.uploadImage.closedImage()
```
