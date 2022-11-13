const router = require("express").Router();
const CategoryController = require("../controllers/Category");

router.post('/',CategoryController.createCategory);
router.get('/',CategoryController.getCategory);
router.delete('/:id',CategoryController.deleteCategory);
router.put('/:id',CategoryController.updateCategory);


module.exports = router;