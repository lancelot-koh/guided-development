export default function GetEntityCount(context) {
  const pageProxy = context.getPageProxy();
  const sectionedTable = pageProxy.getControl('SectionedTable');
  
  sectionedTable.getSections().forEach((section) => {
    const targetSpecifier = section.getTargetSpecifier();
    if (targetSpecifier.getEntitySet() === "Authors") {
      return pageProxy.count(targetSpecifier.getService(), targetSpecifier.getEntitySet(), targetSpecifier.queryOptions).then((count) => {
        return count;
      });
      }
  });
}