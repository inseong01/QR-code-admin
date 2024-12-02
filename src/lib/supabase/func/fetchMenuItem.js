import supabase from "../supabaseConfig";

export default async function fetchMenuItem({ method, itemInfo, table }) {
  let response;

  // method 분류
  switch (method) {
    case 'insert': {
      response = await supabase.from(`qr-order-${table}`).insert([itemInfo]).select();
      return response;
    }
    case 'update': {
      response = await supabase.from(`qr-order-${table}`).update(itemInfo).eq('id', Number(itemInfo.id)).select();
      return response;
    }
    case 'delete': {
      response = await supabase.from(`qr-order-${table}`).delete().eq('id', Number(itemInfo.id));
      return response;
    }
    default: {
      throw new Error(`Method: ${method} is not defined`);
    }
  }
}