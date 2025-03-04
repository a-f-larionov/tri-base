let PageMain = function () {
    let self = this;
    this.blocks = [];

    this.init = function () {
        self.blocks.push(PageBlockBackground);
        self.blocks.push(PageBlockPanel);
        self.blocks.push(PageBlockMaps);
        self.blocks.push(PBZDialogs);
        self.blocks.push(PageBlockWizard);
        self.blocks.push(PageBlockZClouds);
        self.blocks.push(PageBlockZPreloader);
    };
};

/** @type {PageMain} */
PageMain = new PageMain;