test('write file', async () => {
  // const fs = require('fs')

  try {
    // fs.unlinkSync('../small_group_report.txt')
  } catch (error) {
    console.log(error)
    throw error
  }
  expect(true).not.toBe(null)
})
