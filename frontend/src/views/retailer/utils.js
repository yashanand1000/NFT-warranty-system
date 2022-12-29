function createData(data) {
  let items = data.items ? data.items : [];
  let history = [];
  for (let i = 0; i < items.length; i++) {
    history.push({
      date: items[i].created_at,
      serial_no: items[i].serial_no,
      customer: items[i].owner,
      nft_address: items[i].nft_id,
    });
  }
  return {
    name: data.name,
    category: data.category,
    created_at: data.created_at,
    history: history,
  };
}

export { createData };
