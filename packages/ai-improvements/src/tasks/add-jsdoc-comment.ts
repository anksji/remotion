import type {File} from '@babel/types';
import * as recast from 'recast';
import * as tsParser from 'recast/parsers/babel-ts';

export const addJsDocComment = ({
	documentTitle,
	sourceCode,
	comment,
}: {
	documentTitle: string;
	sourceCode: string;
	comment: string;
}) => {
	const trimmed = comment.trim();
	if (!trimmed.startsWith('/**') || !trimmed.endsWith('*/')) {
		throw new Error('Comment must be a block comment');
	}
	const removedComment = '\n' + trimmed.slice(3, -2).trim() + '\n';

	const ast = recast.parse(sourceCode, {
		parser: tsParser,
	}) as File;

	const withoutParentheses = documentTitle
		.replace(/\(.*\)/, '')
		.replace(/\</, '')
		.replace(/\>/, '')
		.replace(/\\/, '');

	let found = false;

	recast.visit(ast, {
		visitExportNamedDeclaration: (p) => {
			const node = p.node;

			if (node.type !== 'ExportNamedDeclaration') {
				return node;
			}

			if (!node.declaration) {
				return node;
			}
			if (node.declaration.type !== 'VariableDeclaration') {
				return node;
			}
			const declaration = node.declaration.declarations[0];
			if (!declaration) {
				return node;
			}
			if (declaration.type !== 'VariableDeclarator') {
				return node;
			}
			if (declaration.id.type !== 'Identifier') {
				return node;
			}
			if (declaration.id.name !== withoutParentheses) {
				return node;
			}

			found = true;
			const newComment = recast.types.builders.commentBlock(removedComment);
			return {
				...node,
				leadingComments: [newComment],
			};
		},
	});

	if (!found) {
		throw new Error(
			'Could not find the function to add the comment to ' + withoutParentheses,
		);
	}

	const output = recast.print(ast, {
		parser: tsParser,
	}).code;

	return output;
};
