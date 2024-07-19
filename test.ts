const main = async () => {
  const res = await fetch('https://api.steinhq.com/v1/storages/6695d1ac4d11fd04f013d7f0/東雲')
  const json = await res.json()
  console.log(json);
}

main();