/* Express */
const express = require('express')
const app = express()

/*Redis */
const Cache = require('./utils/cache')

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.end('test cool')
})

app.get('/getImgTable', async (req, res) => {
  const newName = req.query.name
  const newScore = req.query.score
  let ranks = []

  if (Cache.client.ready) {
    // check rank
    const ranksResult = await Cache.get('godrank')
    if (ranksResult) {
      ranks = JSON.parse(ranksResult)
      let isPush = false
      console.log(ranks)
      for (let rank = 0; rank < ranks.length; rank++) {
        if (newScore > ranks[rank].score) {
          ranks.splice(rank, 0, { name: newName, score: newScore })
          console.log('splice ok')
          console.log(ranks)
          isPush = true
          break
        }
      }
      if (!isPush) {
        ranks.push({ name: newName, score: newScore })
        console.log()
      }
    } else {
      console.log(JSON.stringify([{ name: newName, score: newScore }]))
      ranks = [{ name: newName, score: newScore }]
    }
    await Cache.set('godrank', JSON.stringify(ranks))
    res.send(renderTable(ranks))
  } else {
    return res.send({ error: '抱歉，排名系統掛了' })
  }
})

app.listen(3000, () => {
  console.log('server ok')
})

function renderTable(array) {
  let tableHmtl = `
    <style>
      .leaderboard{
        width: 300px;
      }
      .leaderboard th, .leaderboard td {
        color: rgb(195, 209, 255);
        padding: 15px 30px 15px 30px;
      }
      .title{
        border-bottom: solid 1px rgb(195, 209, 255);
      }
    </style>
    <div class="leaderboard">
    <table>
      <tr class="title"> 
        <th>排名</th>
        <th>姓名</th>
        <th>分數</th>
      </tr>

  `

  for (let i = 0; i < array.length; i++) {
    tableHmtl += `
    <tr>
      <td>${i + 1}</td>
      <td>${array[i].name}</td>
      <td>${array[i].score}</td>
    </tr>
    `
  }

  tableHmtl += `
      </table>    
  </div>
  
  <!-- JS -->

  <script src="http://html2canvas.hertzen.com/dist/html2canvas.js"></script>
  <script type="module" src="picgen.js"></script>
  `

  return tableHmtl
}
