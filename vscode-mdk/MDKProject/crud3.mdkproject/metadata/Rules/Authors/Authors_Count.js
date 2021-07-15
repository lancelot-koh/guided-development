export default function Authors_Count(context) {
  return context.count('/bookshop-mdk/Services/service1.service','Authors', '').then((count) => {
    return count;
  });
}
