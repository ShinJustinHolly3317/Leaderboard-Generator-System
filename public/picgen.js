html2canvas(document.body, { width: 300, height: 300, backgroundColor: null }).then(
  function (canvas) {
    const img = document.createElement('img')
    img.src = canvas.toDataURL('image/png')
    document.body.appendChild(img)
    document.querySelector('.leaderboard').remove()
  }
)