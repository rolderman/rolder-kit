import helpers from "../helpers";

export default [
    { name: 'useDataContext', group: 'Params', type: { name: 'boolean', allowEditOnly: true }, displayName: 'Use context', default: false },
    //{ name: 'dataContextId', group: 'Params', type: 'string', displayName: 'Context id', dependsOn: [{ name: 'useDataContext', value: true }] },
    { name: 'dbClasses', group: 'DB classes output registration', type: 'proplist', displayName: 'DB classes' },
    { name: 'useDataScheme', group: 'Params', type: 'array', displayName: 'Scheme' },
    { name: 'getDataScheme', group: 'Params', type: 'array', displayName: 'Scheme' },
    { name: 'dbClass', group: 'Query params', type: '*', displayName: 'Database class' },
    { name: 'querySize', group: 'Query params', type: 'number', displayName: 'Size', default: 10 },
    { name: 'searchQuerySize', group: 'Query params', type: 'number', displayName: 'Size', default: 10, dependsOn: [{ name: 'useDataContext', value: false }] },
    { name: 'refs', group: 'References', type: 'proplist', displayName: 'References', dependsOn: [{ name: 'useDataContext', value: true }] },
    { name: 'backRefs', group: 'Backward references', type: 'proplist', displayName: 'Backward references', dependsOn: [{ name: 'useDataContext', value: true }] },
    { name: 'searchFields', group: 'Search fields', type: 'proplist', displayName: 'Search fields' },
    { name: 'filters', group: 'Query params', type: 'array', displayName: 'Filters', isObject: true, tooltip: helpers.filters },
    { name: 'searchFilters', group: 'Query params', type: 'array', displayName: 'Filters', isObject: true, tooltip: helpers.filters, dependsOn: [{ name: 'useDataContext', value: false }] },
    { name: 'sorts', group: 'Query params', type: 'array', displayName: 'Sorts', tooltip: helpers.sorts },
    { name: 'aggQuery', group: 'Query params', type: 'array', isObject: true, displayName: 'Aggregations' },
    { name: 'searchSorts', group: 'Query params', type: 'array', displayName: 'Sorts', tooltip: helpers.sorts, dependsOn: [{ name: 'useDataContext', value: false }] },
    { name: 'options', group: 'Query params', type: 'array', displayName: 'Options', isObject: true, tooltip: helpers.options },
    { name: 'getUsers', group: 'Query params', type: 'boolean', displayName: 'Get users', default: false },
    { name: 'searchGetUsers', group: 'Query params', type: 'boolean', displayName: 'Get users', default: false, dependsOn: [{ name: 'useDataContext', value: false }] },
    { name: 'searchEnabled', group: 'Search', type: 'boolean', displayName: 'Enable search', default: false },
    { name: 'searchString', group: 'Search', type: { name: 'string', allowConnectionsOnly: true }, displayName: 'Search string' },
    { name: 'searchScheme', group: 'Search', type: 'array', displayName: 'Search scheme', isObject: true, dependsOn: [{ name: 'searchEnabled', value: true }] },
    { name: 'pending', group: 'States', type: 'boolean', displayName: 'Pending', default: false },
    { name: 'fetching', group: 'States', type: 'boolean', displayName: 'Fetching', default: false },
    { name: 'refetching', group: 'States', type: 'boolean', displayName: 'Refetching', default: false },
    { name: 'searching', group: 'States', type: 'boolean', displayName: 'Searching', default: false, dependsOn: [{ name: 'searchEnabled', value: true }] },
    { name: 'fetched', group: 'Signals', type: 'signal', displayName: 'Fetched' },
    { name: 'founded', group: 'Signals', type: 'signal', displayName: 'Founded' },
    { name: 'fetch', group: 'Signals', type: 'signal', displayName: 'Fetch' },
    { name: 'refetch', group: 'Signals', type: 'signal', displayName: 'Refetch' },
    { name: 'nextFetch', group: 'Pagination', type: 'signal', displayName: 'Next' },
    { name: 'previousFetch', group: 'Pagination', type: 'signal', displayName: 'Previous' },
    { name: 'fetchedPage', group: 'Pagination', type: 'number', displayName: 'Page' },
    { name: 'fetchedItemsCount', group: 'Data', type: 'number', displayName: 'Fetched count' },
    { name: 'totalItemsCount', group: 'Data', type: 'number', displayName: 'Total count' },
    { name: 'search', group: 'Signals', type: 'signal', displayName: 'search' },
    { name: 'aggregations', group: 'Data', type: 'object', displayName: 'Aggregations' },
] as const satisfies readonly NodePort[]