export default function ServiceInitialized(context) {
  var sectionedTable = context.getPageProxy().getControl('SectionedTable');
  if (sectionedTable) {
    sectionedTable.getSections().forEach((section) => {
      if (section.getName() === "Overview_List") {
        section.redraw();
      }
    });
  }
}