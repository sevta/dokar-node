import express from 'express'
import multer from 'multer'
import csv from 'csvtojson'

import userController from '../controller/userController'
import pageController from '../controller/pageController'
import adminController from '../controller/adminController'

const upload = multer({ dest: 'usersCSV/' })
const upload_archive = multer({ inMemory: true })

const router = express.Router();

function authCheck(req , res , next) {
  next()
  // if (req.session.user) {
  //   next()
  // } else {
  //   res.redirect('/')
  // }
} 

// backup old
// router.get('/', userController.index)
// -------------- new routes
router.get('/', authCheck , userController.index)
router.get('/login' , function(req , res , next) {
  if (req.session.user) {
    res.redirect('/')
  } else {
    res.render('auth/login')
  }
})
router.get('/arsip' , authCheck , userController.arsip)
// router.get('/tambaharsip' , authCheck , userController.addArsipView)
router.get('/arsip/add' , authCheck , userController.addArsipView)
router.get('/regulasi' , authCheck , userController.regulasi)
router.get('/profile' , authCheck , userController.profile)
router.get('/arsip/(:id)' , authCheck , userController.viewArsip)
router.get('/arsip/edit/(:id)' , authCheck , userController.editArsip)
router.get('/smep' , authCheck , userController.smep)
router.get('/admin' , authCheck , adminController.index)
router.get('/logout' , authCheck , userController.logout)
router.get('/search' , authCheck , userController.search)
router.get('/arsipdata' , authCheck , userController.arsipData)

router.post('/deletearsip' , userController.deleteData)

router.post('/login' , userController.login)
router.post('/arsip/add' , userController.addArsip)
router.post('/csv' , upload.single('csv') , adminController.handleCsv)
router.post('/seedusers' , adminController.seedUsers)
router.post('/archive' , upload_archive.single('archive') , adminController.handleArchive)
router.post('/updatearsip/(:id)' , userController.updatearsip)



export default router;
