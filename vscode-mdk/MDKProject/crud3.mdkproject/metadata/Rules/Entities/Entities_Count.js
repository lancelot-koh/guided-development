export default function Authors_Count(context) {
  return context.count('/bookshop-mdk/Services/service1.service','Entities', '').then((count) => {
    return count;
  });
}
