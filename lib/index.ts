/***************************
 This class is intended for pagination in a real-world web app.  Though it is a class, most of its
 implementation does not exist as-is.  A subclass must be made, which provides a `dataSource` and
 `__setup` function to this class' constructor.  __setup() becomes a class method and must accept
 dataSource as a parameter, but as for what dataSource is and what __setup() does, that is up to
 the subclass.  The only requirement this class makes is __setup() must assign values to the
 properties `__pageInfo`, `__batchInfo`, and `__pageLoader`, so the code in this class will execute
 properly.

 It's possible to use this class for 'batchination', where, instead of only requesting one page of
 data at-a-time from the server, the client requests a bigger `batch`, the size of which is determined
 by the property `itemsPerBatch`.  Then the batch is paginated in the client.  If the user requests a
 page that would be found in a different batch, the client requests that batch from the server and
 paginates it.  And so on.
 ***************************/

export abstract class AbstractAppPaginator {

	private __currentPageNumber: number;


	// These 3 properties must be assigned values inside `this.__setup()` (see constructor).

	private __pageInfo: { itemsPerPage: number, totalPages: number };
	private __batchInfo: { itemsPerBatch: number };

	private __pageLoader: {

		loadPage: (pageNumber) => void,

		// Must load `pageNumber` all over again, even if that page is already currently loaded.

		forceLoadPage: (pageNumber) => void,

		// All items in the loaded page.

		loadedPage: any[]
	};


	constructor(dataSource, private __setup: (dataSource) => void) {
		this.__setup(dataSource);
	}


	// Total number of items the app can have loaded in memory.  Set this to highest number that
	// does not negatively affect app performance.

	set itemsPerBatch(value) {
		this.__batchInfo.itemsPerBatch = value;
	}


	get itemsPerBatch(): number {
		return this.__batchInfo.itemsPerBatch;
	}


	set itemsPerPage(value) {
		this.__pageInfo.itemsPerPage = value;
	}


	get itemsPerPage(): number {
		return this.__pageInfo.itemsPerPage;
	}


	// Setting this.currentPageNumber automatically updates this.currentPage

	set currentPageNumber(value) {
		this.__pageLoader.loadPage(value);
		this.__currentPageNumber = value;
	}


	get currentPageNumber(): number {
		return this.__currentPageNumber;
	}


	get currentPage(): any[] {
		return this.__pageLoader.loadedPage;
	}


	get totalPages(): number {
		return this.__pageInfo.totalPages;
	}


	// Intended to be called after the order of the dataset changes (like after sorting),
	// or after the total number of items changes (like after a search).

	reset(): void {
		this.__pageLoader.forceLoadPage(1);
		this.__currentPageNumber = 1;
	}


}
