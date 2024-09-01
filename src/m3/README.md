<!--
  I probably won't actually make this into its own repo
  don't think that because there is a README.md file,
  it's its own git repo.
-->

# MMP Module Manager

- _aka_ MMM _aka_ M3 (official-est name)

A CLI Tool to automagically manage your modules.

(no more manually `git clone`-ing dependencies!)

<!-- Upon further inspection, this idea is shit
# Specification vs Implementation

Some call it a bug, but I call it (either) a revoluionary (or stupid) idea.

Instead of just writing a _package_, what you might do in other scenarios. You write a specification.

Nothing formal, it can be just a markdown file or, if you want to get more fancy, a [d.ts type definition](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html).

But then, modules, packages, libraries, whatever you want to call them (modules, in this case) are identified (imported by other modules/packages/libraries) by their specification, not their implementation.

`ddg.chat`, the semi-official (made by Dinhero Development Group, the same people who made MMP, the module loader) chat library, is then the specification that defines how a chat library should behave.

`ddg.chat`, instead of declaring how chat parsing should be implemented (by analyzing the downstream `chat_message` and `chat_command` packets), declares how a chat library should interface and expose itself to the rest of the ecosystem (there should be a default exported object that has `writeDownstream` and `writeUpstream` functions ...)

This allows you to mix and match implementations, as long as they share the same specification.

I don't really see any real-world use for this aside from person A creating a module, deprecating/archiving/abandoning it and person B creating an equivalent better module.

Things like this happen all the time in other ecosystems and are usually referred to as "spiritual successors". So my idea might not be so revolutionary after all.
-->
