export function SetCaption(context, sectionedTableName, title) {
  const pageProxy = context.getPageProxy();
  const sectionedTable = pageProxy.getControl(sectionedTableName);
  const sections = sectionedTable.getSections();
  if (sections.length > 0) {
    const section = sectionedTable.getSections()[0];
    const targetSpecifier = section.getTargetSpecifier();
    return pageProxy.count(targetSpecifier.getService(), targetSpecifier.getEntitySet(), targetSpecifier.queryOptions).then((count) => {
      pageProxy.setCaption(title + ' (' + count + ')');
    });
  }
}