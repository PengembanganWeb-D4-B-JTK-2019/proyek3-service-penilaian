import express from 'express'
import * as KelasController from '../controller/Kelas'

const router = express.Router()

router.get('/list-tahun', KelasController.getListTahun)

export default router
