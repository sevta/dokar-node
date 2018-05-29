import express from 'express'
import multer from 'multer'
import csv from 'csvtojson'

import userController from '../controller/userController'
import pageController from '../controller/pageController'
import adminController from '../controller/adminController'

const upload = multer({ dest: 'usersCSV/' })
const upload_archive = multer({ inMemory: true })

const router = express.Router();

router.get('/', userController.index)
router.post('/login' , userController.login)

router.get('/arsip/add' , userController.addArsipView)
router.post('/arsip/add' , userController.addArsip)
router.get('/regulasi' , userController.regulasi)
router.get('/arsip' , userController.arsip)
router.get('/profile' , userController.profile)
router.get('/arsip/(:id)' , userController.viewArsip)
router.get('/arsip/edit/(:id)' , userController.editArsip)

router.get('/smep' , userController.smep)

router.get('/admin' , adminController.index)
router.post('/csv' , upload.single('csv') , adminController.handleCsv)
router.get('/logout' , userController.logout)
router.post('/seedusers' , adminController.seedUsers)

router.post('/archive' , upload_archive.single('archive') , adminController.handleArchive)

export default router;
