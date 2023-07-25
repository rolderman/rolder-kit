import { enums, units, groups } from "./utils"

const sharedProps = {
    notificationsPosition: { group: 'Notifications', displayName: 'Notifications position', type: { name: 'enum', enums: enums.notificationsPositions }, default: 'bottom-right' },
    detectColorScheme: { type: 'boolean', displayName: 'Autodetect color scheme', group: 'Theme' },
    colorScheme: { type: { name: 'enum', enums: enums.colorSchemes }, displayName: 'Default color scheme', group: 'Theme' },
    sx: { type: 'array', displayName: 'Custom sx', group: 'Advanced Style', tooltip: "Example: [{ width: 100 }]" },
    // general
    disabled: { type: 'boolean', displayName: 'Disabled', group: groups.general },
    // dimensions
    size: { type: { name: 'enum', enums: enums.sizes }, displayName: 'Size', group: groups.dimensions },
    sizeUnits: { type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Size', group: groups.dimensions },
    sizeString: { type: 'string', displayName: 'Size', group: groups.dimensions },
    iconSize: { type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Icon size', group: groups.dimensions },
    h: { type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Height', group: groups.dimensions },
    heightString: { type: 'string', displayName: 'Height (string)', group: groups.dimensions },
    minHeight: { type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Min height', group: groups.dimensions },
    w: { type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Width', group: groups.dimensions },
    widthString: { type: 'string', displayName: 'Width (string)', group: groups.dimensions },
    radius: { type: { name: 'enum', enums: enums.sizes }, displayName: 'Radius', group: groups.dimensions },
    gutter: { type: { name: 'enum', enums: enums.sizes }, displayName: 'Gutter', group: groups.dimensions },
    // font
    fz: { type: { name: 'enum', enums: enums.sizes }, displayName: 'Size', group: groups.font },
    fw: { type: { name: 'enum', enums: enums.fontWeights }, displayName: 'Weight', group: groups.font },
    // layout
    m: { type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin', group: groups.layout },
    mt: { type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin top', group: groups.layout },
    mr: { type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin right', group: groups.layout },
    mb: { type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin bottom', group: groups.layout },
    ml: { type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin left', group: groups.layout },
    p: { type: { name: 'enum', enums: enums.sizes }, displayName: 'Padding', group: groups.layout },
    pt: { type: { name: 'enum', enums: enums.sizes }, displayName: 'Padding top', group: groups.layout },
    pr: { type: { name: 'enum', enums: enums.sizes }, displayName: 'Padding right', group: groups.layout },
    pb: { type: { name: 'enum', enums: enums.sizes }, displayName: 'Padding bottom', group: groups.layout },
    pl: { type: { name: 'enum', enums: enums.sizes }, displayName: 'Padding left', group: groups.layout },
    direction: { type: { name: 'enum', enums: enums.directions }, displayName: 'Direction', group: groups.layout, },
    wrap: { type: { name: 'enum', enums: enums.wraps }, displayName: 'Wrap', group: groups.layout },
    stackAlign: { type: { name: 'enum', enums: enums.stackAligns }, displayName: 'Align', group: groups.layout },
    flexAlign: { type: { name: 'enum', enums: enums.flexAligns }, displayName: 'Align', group: groups.layout },
    stackJustify: { type: { name: 'enum', enums: enums.stackJustifies }, displayName: 'Justify', group: groups.layout },
    flexJustify: { type: { name: 'enum', enums: enums.flexJustifies }, displayName: 'Justify', group: groups.layout },
    spacing: { type: { name: 'enum', enums: enums.sizes }, displayName: 'Spacing', group: groups.layout },
    gap: { type: { name: 'enum', enums: enums.sizes }, displayName: 'Gap', group: groups.layout },
    bottomOffset: { type: 'number', displayName: 'Bottom offset', group: groups.layout, default: 0 },
    position: { type: { name: 'enum', enums: enums.positions }, displayName: 'Position', group: groups.layout },
    grow: { type: 'boolean', displayName: 'Grow', group: groups.layout },
    drawerPosition: { type: { name: 'enum', enums: enums.drawerPositions }, displayName: 'Position', group: groups.layout },
    spans: { type: 'array', displayName: 'Spans', group: groups.layout, tooltip: "Example: [4,4,4] One row = 12. Can be number, auto, content" },
    orientation: { type: 'boolean', displayName: 'Vertical', group: groups.layout, default: false },
    // style
    color: { type: { name: 'enum', enums: enums.colors }, displayName: 'Color', group: groups.style },
    loaderVariant: { type: { name: 'enum', enums: enums.loaderVariants }, displayName: 'Variant', group: groups.style },
    avatarVariant: { type: { name: 'enum', enums: enums.avatarVariants }, displayName: 'Variant', group: groups.style },
    iconName: { type: 'string', displayName: 'Icon name', group: groups.style, tooltip: 'Find icon at tabler-icons.io and capitalize it: "IconSuperName"' },
    stroke: { type: 'number', displayName: 'Stroke', group: groups.style },
    shadow: { type: { name: 'enum', enums: enums.sizes }, displayName: 'Shadow', group: groups.style },
    opacity: { type: 'number', displayName: 'Opacity', group: groups.style },
    withBorder: { type: 'boolean', displayName: 'Table borders', group: groups.style },
    backgroundColor: { type: { name: 'enum', enums: enums.colors }, displayName: 'Background color (sx)', group: groups.style },
    colorShade: { type: { name: 'enum', enums: enums.colorShades }, displayName: 'Color shade (sx)', group: groups.style, default: '6' },
    actionVariant: { type: { name: 'enum', enums: enums.actionVariants }, displayName: 'Variant', group: groups.style },
    badgeVariant: { type: { name: 'enum', enums: enums.badgeVariants }, displayName: 'Variant', group: groups.style, default: 'light' },
    // data
    isLoading: { type: 'boolean', displayName: 'Loading', group: groups.data },
    value: { type: 'string', displayName: 'Value', group: groups.data },
    title: { type: 'string', displayName: 'Title', group: groups.data },
    label: { type: 'string', displayName: 'Label', group: groups.data },
    labelField: { type: 'string', displayName: 'Label field', group: groups.data },
    placeholder: { type: 'string', displayName: 'Placeholder', group: groups.data },
    message: { type: 'string', displayName: 'Message', group: groups.data },
    useDataType: { type: { name: 'enum', enums: enums.useDataTypes }, displayName: 'Type', group: groups.useData },
    useDataEnabled: { type: 'boolean', displayName: 'Enabled', group: groups.useData },
    className: { type: 'string', displayName: 'Classname', group: groups.data },
    classNames: { type: 'array', displayName: 'Classnames', group: groups.data, tooltip: "Example: ['product', 'supplier']" },
    setRefs: { type: 'boolean', displayName: 'Set references', group: groups.data, tooltip: "Fill data to reference, if exists at Noodl.Objects" },
    refMap: { type: 'array', displayName: 'Reference map', group: groups.data, tooltip: "Example: [{product: ['supplier', 'warehouse']}]" },
    createItem: { type: 'object', displayName: 'Create item', group: groups.data, tooltip: "Example: {className: 'task', body: {...}}" },
    updateItem: { type: 'object', displayName: 'Update item', group: groups.data, tooltip: "Example: {className: 'task', id: 'task id', body: {...}}" },
    inputString: { type: 'string', displayName: 'Input string', group: groups.data },
    searchString: { type: 'string', displayName: 'Search string', group: groups.data },
    searchFields: { type: 'array', displayName: 'Search fields', group: groups.data, tooltip: "Example: ['content.name.search']" },
    inputItems: { type: 'array', displayName: 'Input items', group: groups.data, tooltip: "Example: [{ value: 'option-1', label: 'Option 1' }]" },
    searchEnabled: { type: 'boolean', displayName: 'Search enabled', group: groups.data },
    foundedData: { type: 'object', displayName: 'Founded data', group: groups.data },
    dateFormat: { type: 'string', displayName: 'Date format', group: groups.data, default: 'YYYY-MM-DD HH:mm' },
    createField: { type: 'string', displayName: 'Create field', group: groups.data },
    // table 
    tableData: { type: 'object', displayName: 'Table data', group: groups.data },
    columns: { type: 'array', displayName: 'Columns', group: 'Table' },
    fontSize: { type: { name: 'enum', enums: enums.sizes }, displayName: 'Font size', group: groups.style },
    borderRadius: { type: { name: 'enum', enums: enums.sizes }, displayName: 'Border radius', group: groups.style },
    verticalSpacing: { type: { name: 'enum', enums: enums.sizes }, displayName: 'Vertical spacing', group: groups.layout },
    withBorder: { type: 'boolean', displayName: 'Table borders', group: groups.style },
    withColumnBorders: { type: 'boolean', displayName: 'Column borders', group: groups.style },
    noHeader: { type: 'boolean', displayName: 'No header', group: 'Table' },
    selectable: { type: 'boolean', displayName: 'Selectable', group: 'Selectable' },
    selectableType: { type: { name: 'enum', enums: enums.selectableTypes }, displayName: 'Type', group: 'Selectable', default: 'singleRow' },
    highlightOnHover: { type: 'boolean', displayName: 'Hightlight row on hover', group: 'Selectable' },
    highlightSelectedRow: { type: 'boolean', displayName: 'Hightlight selected row', group: 'Selectable' },
    selectFirstItem: { type: 'boolean', displayName: 'Select first item', group: 'Selectable' },
    resetSelected: { type: 'boolean', displayName: 'Reset selected', group: 'Selectable' },
    // etable
    tableScheme: { type: 'array', displayName: 'Table scheme', group: groups.data },
    filterMaps: { type: 'array', displayName: 'Filter maps', group: groups.data },
    sendViewItem: { type: 'signal', displayName: 'View item clicked', group: groups.signals },
    sendEditItem: { type: 'signal', displayName: 'Edit item clicked', group: groups.signals },
    // appshell
    enableHeader: { type: 'boolean', displayName: 'Header', group: 'App layout' },
    enableFooter: { type: 'boolean', displayName: 'Footer', group: 'App layout' },
    enableNavbar: { type: 'boolean', displayName: 'Navbar', group: 'App layout' },
    navItems: { type: 'array', displayName: 'Navigation items', group: groups.navigation },
    // params
    autoClose: { type: 'number', displayName: 'Autoclose (ms)', group: groups.params },
    withCloseButton: { type: 'boolean', displayName: 'With close button', group: groups.style, default: false, tooltip: "Hides close button and title" },
    withAsterisk: { type: 'boolean', displayName: 'With asterisk', group: groups.params },
    query: { type: 'array', displayName: 'Query', group: groups.params, tooltip: "Example: [{ content.name: { 'ta-da!!!'} }]" },
    sorts: { type: 'array', displayName: 'Sorts', group: groups.params, tooltip: "Example: [{ content.name: 'asc' }]" },
    options: { type: 'array', displayName: 'Options', group: groups.params, tooltip: "Example: [{ size: 100 }]" },
    id: { type: 'string', displayName: 'Object id', group: groups.params },
    ids: { type: 'array', displayName: 'Objects Ids', group: groups.params, tooltip: "Example: ['id1', 'id2']" },
    offsetScrollbars: { type: 'boolean', displayName: 'Offset scrollbars', group: groups.params },
    searchable: { type: 'boolean', displayName: 'Searchable', group: groups.params },
    clearable: { type: 'boolean', displayName: 'Clearable', group: groups.params },
    creatable: { type: 'boolean', displayName: 'Creatable', group: groups.params },
    limitMinDate: { type: 'boolean', displayName: 'Limit minimal date', group: groups.params, default: false },
    daysOffset: { type: 'number', displayName: 'Minimum days offset', group: groups.params, default: 0, tooltip: 'Number of days to offset. Negative for past offset' },
    debounced: { type: 'boolean', displayName: 'Debounced', group: groups.params, default: false, tooltip: 'Delay typed string at output' },
    delay: { type: 'number', displayName: 'Delay (ms)', group: groups.params, default: 350 },
    buttonType: { type: { name: 'enum', enums: enums.buttonTypes }, displayName: 'Button type', group: groups.params, tooltip: '"Submit" to trigger form' },
    // signals
    show: { type: 'boolean', displayName: 'Show', group: groups.signals },
    // form
    useForm: { type: 'boolean', displayName: 'Use form', group: groups.form },
    formField: { type: 'string', displayName: 'Form field', group: groups.form },
    formHook: { type: 'object', displayName: 'Form hook', group: groups.form },
    formScheme: { type: 'array', displayName: 'Form scheme', group: groups.data, tooltip: "Example: [{name: 'startDate', initialValue: new Date(), validate: isNotEmpty}]" },
    // uploadFiles
    filesData: { type: 'array', displayName: 'Files data', group: groups.data, tooltip: "Example: [{name: ..., contentType: 'image/jpeg', data: base64}]" },
    folder: { type: 'string', displayName: 'Folder', group: groups.data },
    // outputs
    sendInited: { type: 'signal', displayName: 'Inited', group: groups.data },
    jwtValidationFailed: { type: 'signal', displayName: 'JWT validation failed', group: groups.auth },
    jwtValidationSucceed: { type: 'signal', displayName: 'JWT validation succeed', group: groups.auth },
    authenticated: { type: 'signal', displayName: 'Authenticated', group: groups.auth },
    sendLoaded: { type: 'signal', displayName: 'Loaded', group: groups.data },
    sendSelected: { type: 'signal', displayName: 'Selected', group: groups.data },
    sendClicked: { type: 'signal', displayName: 'Clicked', group: groups.signals },
    selectedValue: { type: 'string', displayName: 'Selected value', group: groups.data },
    selectedItem: { type: 'object', displayName: 'Selected item', group: groups.data },
    selectedItems: { type: 'array', displayName: 'Selected items', group: groups.data },
    selectedPath: { type: 'string', displayName: 'Selected path', group: groups.navigation },
    pathChanged: { type: 'signal', displayName: 'Path changed', group: groups.navigation },
    isUpdating: { type: 'boolean', displayName: 'Updating', group: groups.data },
    sendUpdated: { type: 'signal', displayName: 'Updated', group: groups.data },
    isCreating: { type: 'boolean', displayName: 'Creating', group: groups.data },
    sendCreated: { type: 'signal', displayName: 'Created', group: groups.data },
    isDeleting: { type: 'boolean', displayName: 'Deleting', group: groups.data },
    sendDeleted: { type: 'signal', displayName: 'Deleted', group: groups.data },
    sendSubmited: { type: 'signal', displayName: 'Submited', group: groups.data },
    sendHided: { type: 'signal', displayName: 'Hided', group: groups.signals },
    isUploading: { type: 'boolean', displayName: 'Uploading', group: groups.data },
    sendUploaded: { type: 'signal', displayName: 'Uploaded', group: groups.signals },
    uploadedUrls: { type: 'array', displayName: 'Uploaded urls', group: groups.data },
    screenshot: { type: 'string', displayName: 'Screenshot', group: groups.data },
    sendScreenshot: { type: 'signal', displayName: 'Screenshot ready', group: groups.data },
    doCreate: { type: 'signal', displayName: 'Create', group: groups.signals },
    createValue: { type: 'string', displayName: 'Create value', group: groups.data },
    createdItem: { type: 'object', displayName: 'Created item', group: groups.data },
    doDelete: { type: 'signal', displayName: 'Delete', group: groups.signals },
    deleteItemId: { type: 'string', displayName: 'Delete item id', group: groups.data },
}

export default sharedProps