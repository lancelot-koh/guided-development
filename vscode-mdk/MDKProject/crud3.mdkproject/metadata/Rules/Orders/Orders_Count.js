export default function Authors_Count(context) {
  return context.count('/bookshop-mdk/Services/service1.service','Orders', '').then((count) => {
    return count;
  });
}
