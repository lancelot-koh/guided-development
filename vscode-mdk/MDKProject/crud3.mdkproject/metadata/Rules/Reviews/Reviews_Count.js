export default function Authors_Count(context) {
  return context.count('/bookshop-mdk/Services/service1.service','Reviews', '').then((count) => {
    return count;
  });
}
