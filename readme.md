# ToUNo-App

โปรแกรมเช็คอะนิเมะไฟล์ในเครื่อง เช็คจำนวนตอน แล้วชื่อเรื่องที่ซ้ำกัน 

## หลักการทำงาน

เลือกโฟลเดอร์ขึ้นมาจากเครื่องแล้วดึงข้อมูลจาก API `anilist.co` เพื่อเก็บข้อมูลลง MongoDB ด้วยเซริฟเวอร์ `touno.co` ตรวจสอบข้อมูลในเครื่อง และหเก็บข้อมูลขึ้น cloud database

---

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron app for production
npm run build

# lint all JS/Vue component files in `app/src`
npm run lint

# run webpack in production
npm run pack
```
---
