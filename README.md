# cockpit

Better UI for the Jira Board.

The Jira UI is not very responsive. We can do better. 
Cockpit is an attempt to build a better UI, and integrate many other usefull sources of information.

We want a trello-like board with:
(I assume that you have a workflow where: 1 jira issue <-> 1 git branch <-> one build in your build tool)

 - Card info
 - Build status info (Timer indicating the build time / status for the build of this branch)
 - Branch merge status (Is the branch of this card merged on staging/develop/master ?)
 - Time spent timer (what is the time spent / time elapsed status)
 
It is forked from a trello-like project in meteor.
It uses the JIRA rest api and web hooks, circleCI api, and git/github api.
