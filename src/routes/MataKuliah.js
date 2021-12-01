import express from 'express'
import * as MataKuliahController from '../controller/Mata Kuliah'
import * as ValidatorSanitizer from '../middleware/InputValidatorSanitizer'

const router = express.Router()

router.get('/list-semester', MataKuliahController.getListSemester)
router.post('/new-matkul', ValidatorSanitizer.postNewMatkul, MataKuliahController.postNewMatkul)
router.get('/all-matkul', MataKuliahController.getAllMatkul)
router.get('/get-one/:id', MataKuliahController.getOneMatkulById)
router.delete('/delete-matkul-by-id/:id', MataKuliahController.deleteMatkulbyId)
router.put('/update-matkul-by-id/:id', MataKuliahController.updateDataMatkulById)

export default router
