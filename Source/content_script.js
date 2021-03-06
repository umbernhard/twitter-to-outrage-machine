function walk(rootNode)
{
    // Find all the text nodes in rootNode
    var walker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_TEXT,
        null,
        false
    ),
    node;

    // Modify each text node's value
    while (node = walker.nextNode()) {
        handleText(node);
    }
}

function handleText(textNode) {
    textNode.nodeValue = replaceText(textNode.nodeValue);
}

function replaceText(v)
{
	v = v.replace(/\bRetweeted\b/g, "Reraged");
	v = v.replace(/\bRetweet\b/g, "Rerage");

//	v = v.replace(/([^-]|[^="]|\b)retweet\b/g, "$1rerage");
//	v = v.replace(/([^-]|[^=]\b)tweet\b/g, "$1rage");
//	v = v.replace(/([^-]|[^="]|\b)tweets\b/g, "$1rages");
//	v = v.replace(/([^-]|[^="]|\b)tweeted\b/g, "$1raged");
//	v = v.replace(/ tweets\b/g, "rages");
	v = v.replace(/\bTweet\b/g, "Rage");
	v = v.replace(/\bTweets\b/g, "Rages");
	v = v.replace(/\bTweetstorm\b/g, "Rage-rant");
	v = v.replace(/\btweetstorm\b/g, "rage-rant");

	v = v.replace(/\bTwitter\b/g, "Outrage Machine");
    v = v.replace(/\btwitter.com\b/g, "outragemachine.com");
	v = v.replace(/\btwitter\b/g, "outrage machine");
    return v;
}

// Returns true if a node should *not* be altered in any way
function isForbiddenNode(node) {
    return node.isContentEditable || // DraftJS and many others
    (node.parentNode && node.parentNode.isContentEditable) || // Special case for Gmail
    (node.tagName && (node.tagName.toLowerCase() == "textarea" || // Some catch-alls
                     node.tagName.toLowerCase() == "input"));

}

// The callback used for the document body and title observers
function observerCallback(mutations) {
    var i, node;

    mutations.forEach(function(mutation) {
        for (i = 0; i < mutation.addedNodes.length; i++) {
            node = mutation.addedNodes[i];
            if (isForbiddenNode(node)) {
                // Should never operate on user-editable content
                continue;
            } else if (node.nodeType === 3) {
                // Replace the text for text nodes
                handleText(node);
            }  else {
                // Otherwise, find text nodes within the given node and replace text
                walk(node);
            }
        }
    });
}

// Walk the doc (document) body, replace the title, and observe the body and title
function walkAndObserve(doc) {
    var docTitle = doc.getElementsByTagName('title')[0],
    observerConfig = {
        characterData: true,
        childList: true,
        subtree: true
    },
    bodyObserver, titleObserver;

    // Do the initial text replacements in the document body and title
    walk(doc.body);
    doc.title = replaceText(doc.title);

    // Observe the body so that we replace text in any added/modified nodes
    bodyObserver = new MutationObserver(observerCallback);
    bodyObserver.observe(doc.body, observerConfig);

    // Observe the title so we can handle any modifications there
    if (docTitle) {
        titleObserver = new MutationObserver(observerCallback);
        titleObserver.observe(docTitle, observerConfig);
    }

    if (doc.getElementById("search-query")) {
        doc.getElementById("search-query").placeholder="Search Outrage Machine";
    }
}
walkAndObserve(document);
