/**
 * Page controller
 * @type {PageController}
 * @constructor
 */
let PageController = function () {
    let self = this;

    let currentPage;

    /**
     * All blocks
     * @type {Array}
     */
    let blocks = [];

    /**
     * Add page blocks to page controller stack.
     * @param blocksToAdd {Array} массив.
     */
    this.addBlocks = function (blocksToAdd) {
        blocksToAdd.forEach(function (block) {
            blocks.push({
                block: block,
                showed: false
            });
            if (!block.init) {
                Logs.log("PageController.addPage. block must have method init(). ", Logs.LEVEL_ERROR, block);
            }
            if (!block.show) {
                Logs.log("PageController.addPage. block must have method show().", Logs.LEVEL_ERROR, block);
            }
            if (!block.hide) {
                Logs.log("PageController.addPage. block must have method hide()", Logs.LEVEL_ERROR, block);
            }
            if (!block.redraw) {
                Logs.log("PageController.addPage. block must have method redraw()", Logs.LEVEL_ERROR, block);
            }
            block.init();
        });
    };

    /**
     * Show requested page-blocks, and hide other page-blocks
     * @param pagesToShow {Array}
     */
    this.showBlocks = function (pagesToShow) {
        let toShow;
        for (let i in blocks) {
            toShow = false;
            for (let j in pagesToShow) {
                if (blocks[i].block === pagesToShow[j]) {
                    toShow = true;
                }
            }
            if (toShow) {
                if (blocks[i].showed === false) {
                    blocks[i].block.show();
                    blocks[i].showed = true;
                }
            } else {
                if (blocks[i].showed === true) {
                    blocks[i].block.hide();
                    blocks[i].showed = false;
                }
            }
        }

        self.redraw();
    };

    let pendingData = false;

    this.redrawCount = 0;

    this.pendingData = function (value) {
        pendingData = value;
    };

    let redrawTimer = null;
    /**
     * Redraw all page-blocks(include hidden)
     */
    this.redraw = function () {
        if (pendingData) {
            if (!redrawTimer) {
                redrawTimer = setTimeout(PageController.redraw, 1000);
            }
            return;
        }
        redrawTimer = null;
        PageController.redrawCount++;
        /*blocks.forEach(function(block){
            block.block.redraw();
        });
        */
        for (let i in blocks) {
            blocks[i].block.redraw();
        }
    };

    /**
     * Show requested page with page-blocks
     * @param page
     */
    this.showPage = function (page) {
        currentPage = page;
        self.showBlocks(page.blocks);
    };

    /**
     * Is page showed now?
     * @param page
     */
    this.isShowedNow = function (page) {
        return page === currentPage;
    };

    /**
     * Return current page
     * @returns {*}
     */
    this.getCurrentPage = function () {
        return currentPage;
    };
};

/** @type {PageController} */
PageController = new PageController();